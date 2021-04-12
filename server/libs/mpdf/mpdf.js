const PDFDocument = require('pdfkit');
const fs = require('fs');
const { page } = require('pdfkit');
const table = require('./mpdf-table');

const defaultPageOptions = {
    size: 'A4',
    dpi: 400,
    margins: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50
    }
};



class mPDF {
    constructor(filename) {
        this.pageCount = 0;
        this.filename = filename;
        this.doc = new PDFDocument({ autoFirstPage: false, size: 'A4' });
        this.blockedHeaders = [];
    }

    setHeaderByPage(pageIdx, callback) {
        this.blockedHeaders.push(pageIdx);
        this.doc.on('pageAdded', () => {
            if (this.pageCount + 1 == pageIdx) {

                callback();

                this.doc.text('', defaultPageOptions.margins.left, 210);
            }
            this.pageCount++;
        });
    }

    setHeader(callback) {
        this.doc.on('pageAdded', () => {
            console.log('aquies');
            if (!this.blockedHeaders.find(elm => elm === this.pageCount + 1)) {
                this.pageCount++;
                callback();
            }
        });
    }

    addPage(options = undefined) {
        let foptions = defaultPageOptions
        if (options) {
            foptions = {...defaultPageOptions, ...options }
        }
        this.doc.addPage(foptions)
    }

    text(str, x = undefined, y = undefined, options = undefined) {
        this.doc.text(str, x, y, options);
    }

    image(src, x = undefined, y = undefined, options = undefined) {
        this.doc.image(src, x, y, options);
    }

    save() {
        this.doc.pipe(fs.createWriteStream(this.filename)); // escribir PDF
        this.doc.end();
    }

    table() {
        return table(this);
    }

    page() {
        return this.doc.page;
    }

    download(res){
        res.set('Content-Disposition', 'attachment; filename=' + this.filename)
        this.doc.pipe(res)
        this.doc.end();
    }

}

module.exports = { options: defaultPageOptions, mPDF };