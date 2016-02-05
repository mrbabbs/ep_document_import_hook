# Document Import Hook

Gives the possibility to import document like PDF, DOC, and DOCX using
external tool like LibreOffice.

Supported File:
* PDF
* DOC
* ODT
* DOCX

## Installation

Install using /admin/plugins 

###### OR

```
git clone https://github.com/mrbabbs/ep_document_import_hook.git ep_document_import_hook
```

## Settings

Add in your 'settings.json' file:

```
  "ep_document_import_hook": {
    "tool": ""
  }
```

if you want "soffice" as command for LibreOffice installed in default path

###### OR

```
 "ep_document_import_hook": {
    "tool": "[/path/to/libreoffice]"
  }
```

if you want to use a different command for LibreOffice

## Requirements

* Linux (only supported platform)
* etherpad-lite >= 1.5.7
* LibreOffice >= 4.4

## TODO

* Add feature to allow using different tool for different file format.
* Add support to other lenguages for the display message.
* Check compatibility with OpenOffice.
* Add support for other platform like Windows and MacOSX.
* Check compatibility with etherpadlite version < 1.5.7
