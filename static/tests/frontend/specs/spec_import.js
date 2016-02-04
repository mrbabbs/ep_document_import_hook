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

    function importRequest(data, importUrl, type, response) {
        var success;
        var error;
        var result = $.ajax({
            url: importUrl,
            type: "post",
            processData: false,
            async: false,
            contentType: 'multipart/form-data; boundary=boundary',
            accepts: {
                text: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            },
            data: 'Content-Type: multipart/form-data; boundary=--boundary' +
                '\r\n\r\n--boundary\r\nContent-Disposition: form-data; ' +
                'name="file"; filename="import.'+type+'"\r\n' +
                'Content-Type: text/plain\r\n\r\n' + data + '\r\n\r\n--boundary',
            error: function (res){
                error = res;
            },
            success: response
        })
        expect(error).to.be(undefined);
        return result;
    }

    function exportfunc(link){
        var exportresults = []
        $.ajaxSetup({
            async:false
        });

        $.get(link+"/export/html",function(data){
            var start = data.indexOf("<body>")
            var end = data.indexOf("</body>")
            var html = data.substr(start+6,end-start-6)
            exportresults.push(["html",html])
        });

        $.get(link+"/export/txt",function(data){
            exportresults.push(["txt",data])
        });

        return exportresults;
    }

    it('import simple txt', function (done) {
        var importUrl = helper.padChrome$.window.location.href +
            '/import';
        var firstLine = 'imported simple text';
        var lastLine = 'Done with success';
        var response;
        var result = importRequest(firstLine +
            '\n' +
            lastLine, importUrl, 'txt', function (res) {
            response = res;
        });

        helper.waitFor(function () {
            var innerTextPad = getinnertext();
            var test = expect(
                    innerTextPad.indexOf(firstLine)).not.to.be(-1) &&
                expect(
                    innerTextPad.indexOf(lastLine)).not.to.be(-1);
            return test;
        }, 2000).done(done);
    });

    it('import simple html', function (done) {
        var importUrl = helper.padChrome$.window.location.href +
            '/import';
        var simpleHtml = '<html><head><title>Simple HTML</title></head>' +
            '<body>imported simple html<br>Done with success</body></html>';
        var response;
        var result = importRequest(simpleHtml, importUrl, 'html', 
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
        }, 2000).done(done);
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

    // TODO
    // create test for other file formats (.odt, .pdf, .doc, .docx)
});
