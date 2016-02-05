describe('Document Import Hook', function () {
    beforeEach(function (cb) {
        helper.newPad(cb);
        this.timeout(60000);
    });

    function getinnertext() {
        var inner = helper.padInner$;
        if(!inner){
                return ""
        }
        var newtext = ""
        inner("div").each(function (line,el) {
                newtext += el.innerHTML+"\n"
        });

        return newtext
    }

    function importRequest(data, importUrl, cType, type, response) {
        var success;
        var error;
        var formD = new FormData();
        formD.append('filename', 'import.' + type);
        formD.append('file',
                new Blob([data], {type: cType}),
                'import.' + type);
        var result = $.ajax({
            url: importUrl,
            type: "post",
            processData: false,
            async: false,
            contentType: false,
            accepts: {
                text: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            },
            data: formD,
            error: function (res){
                error = res;
            },
            success: response
        })
        expect(error).to.be(undefined);
        return result;
    }

    function readDoc(url, cb) {
        var rawFile = new XMLHttpRequest();
        rawFile.open('GET', url, true);
        rawFile.responseType = 'arraybuffer';
        rawFile.setRequestHeader('Content-type', 'text/plain; charset=utf-8');
        rawFile.onload = function(e) {
            if (this.status == 200) {
                var uInt8Array = new Uint8Array(this.response);
                cb(this.response);
            };
                                                  };
        rawFile.send(null);
    }

    it('import simple txt', function (done) {
        var importUrl = helper.padChrome$.window.location.href +
            '/import';
        var firstLine = 'imported simple text';
        var lastLine = 'Done with success';
        var response;
        var simpleText = firstLine +
            '\n' +
            lastLine;
        var result = importRequest(simpleText, importUrl,
            'text/plain', 'txt', function (res) {
            response = res;
        });

        helper.waitFor(function () {
            var innerTextPad = getinnertext();
            var test = expect(
                    innerTextPad.indexOf(firstLine)).not.to.be(-1) &&
                expect(
                    innerTextPad.indexOf(lastLine)).not.to.be(-1);
            return test;
        }).done(done);
    });

    it('import simple html', function (done) {
        var importUrl = helper.padChrome$.window.location.href +
            '/import';
        var simpleHtml = '<html><head><title>Simple HTML</title></head>' +
            '<body>imported simple html<br>Done with success</body></html>';
        var response;
        var result = importRequest(simpleHtml, importUrl, 'text/plain', 'html',
            function (res) {
                response = res;
            });

        helper.waitFor(function () {
            var innerTextPad = getinnertext();
            var test = expect(
                    innerTextPad.indexOf('<span class="">' +
                        'imported simple html</span')).not.to.be(-1) &&
             expect(innerTextPad.indexOf('<span class="">' +
                        'Done with success</span')).not.to.be(-1);

            return test;
        }).done(done);
    });

    it('import simple pdf', function (done) {
        var importUrl = helper.padChrome$.window.location.href +
            '/import';
        var protocol = helper.padChrome$.window.location.protocol;
        var docUrl = protocol +
            '//' +
            helper.padChrome$.window.location.host +
            '/static/plugins/ep_document_import_hook/static/tests/frontend/doc_test/doc_test.pdf';
        var result;
        var response;
        readDoc(docUrl, function (res) {
            result = importRequest(res, importUrl,
                'application/pdf' ,
                'pdf',
                function (data) {
                response = data;
            });

             helper.waitFor(function () {
                var innerTextPad = getinnertext();
                var test = expect(response.indexOf('\'ok\'')).not.to.be(-1) &&
                expect(innerTextPad.indexOf('<span class="">' +
                        'imported simple pdf</span>')).not.to.be(-1) &&
                expect(innerTextPad.indexOf('<span class="">' +
                        'Done with success</span>')).not.to.be(-1);

                return test;
            }).done(done);
        });
    });

    it('import simple odt', function (done) {
        var importUrl = helper.padChrome$.window.location.href +
            '/import';
        var protocol = helper.padChrome$.window.location.protocol;
        var docUrl = protocol +
            '//' +
            helper.padChrome$.window.location.host +
            '/static/plugins/ep_document_import_hook/static/tests/frontend/doc_test/doc_test.odt';
        var result;
        var response;
        readDoc(docUrl, function (res) {
            result = importRequest(res,
                importUrl,
                'application/vnd.oasis.opendocument.text' ,
                'odt',
                function (data) {
                response = data;
            });

             helper.waitFor(function () {
                var innerTextPad = getinnertext();
                var test = expect(response.indexOf('\'ok\'')).not.to.be(-1) &&
                expect(innerTextPad.indexOf('<span class="">' +
                        'imported simple odt</span>')).not.to.be(-1) &&
                expect(innerTextPad.indexOf('<span class="">' +
                        'Done with success</span>')).not.to.be(-1);

                return test;
            }).done(done);
        });
    });

    it('import simple doc', function (done) {
        var importUrl = helper.padChrome$.window.location.href +
            '/import';
        var protocol = helper.padChrome$.window.location.protocol;
        var docUrl = protocol +
            '//' +
            helper.padChrome$.window.location.host +
            '/static/plugins/ep_document_import_hook/static/tests/frontend/doc_test/doc_test.doc';
        var result;
        var response;
        readDoc(docUrl, function (res) {
            result = importRequest(res,
                importUrl,
                'application/msword' ,
                'doc',
                function (data) {
                response = data;
            });

             helper.waitFor(function () {
                var innerTextPad = getinnertext();
                var test = expect(response.indexOf('\'ok\'')).not.to.be(-1) &&
                expect(innerTextPad.indexOf('<span class="">' +
                        'importedsimple doc</span>')).not.to.be(-1) &&
                expect(innerTextPad.indexOf('<span class="">' +
                        'Donewith success</span>')).not.to.be(-1);

                return test;
            }).done(done);
        });
    });

    it('import simple docx', function (done) {
        var importUrl = helper.padChrome$.window.location.href +
            '/import';
        var protocol = helper.padChrome$.window.location.protocol;
        var docUrl = protocol +
            '//' +
            helper.padChrome$.window.location.host +
            '/static/plugins/ep_document_import_hook/static/tests/frontend/doc_test/doc_test.docx';
        var result;
        var response;
        readDoc(docUrl, function (res) {
            result = importRequest(res,
                importUrl,
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ,
                'docx',
                function (data) {
                response = data;
            });

             helper.waitFor(function () {
                var innerTextPad = getinnertext();
                var test = expect(response.indexOf('\'ok\'')).not.to.be(-1) &&
                expect(innerTextPad.indexOf('<span class="">' +
                        'importedsimple docx</span>')).not.to.be(-1) &&
                expect(innerTextPad.indexOf('<span class="">' +
                        'Donewith success</span>')).not.to.be(-1);

                return test;
            }).done(done);
        });
    });

    it('display import hook message', function (done) {
        var idDivMessage = '#importmessagehook';
        var importColumn = helper.padChrome$(idDivMessage);
        var div = null;
        expect(importColumn.length).to.be(1);
        if (importColumn.length) {
            expect(importColumn[0].innerHTML).not.to.be('');
        }
        done();
    });
});
