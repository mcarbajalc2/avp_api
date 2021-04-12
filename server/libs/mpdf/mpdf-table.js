class PDFTable {
    constructor(pdf) {
        this.pdf = pdf;
        this.rows = [];
        this.col_size = 0;
        this.pdf.doc.moveDown();
        this.init = {
            y: Number(this.pdf.doc.y),
            page: Number(this.pdf.pageCount)
        }
        this.pdf.doc.fontSize(8);
    }

    addRow(arr) {
        this.rows.push(arr);
        this.col_size = arr.length > this.col_size ? arr.length : this.col_size;
    }

    getMaxHeight(row) {
        let max_height = 0;
        for (let i in row) {
            const cell = row[i];
            const height = this.pdf.doc.heightOfString(cell.text, { width: cell.width - 10 }) + 8;
            max_height = max_height < height ? height : max_height;
        }
        return max_height;
    }

    build() {
        const left = Number(this.pdf.doc.page.margins.left);
        const right = Number(this.pdf.doc.page.margins.right);
        const width = Number(this.pdf.doc.page.width);
        const cellWidth = (width - (left + right)) / this.col_size;
        let y = this.init.y;

        for (let i in this.rows) {
            const row = this.rows[i];
            let max_height = 0;


            let x = left;

            // Pintar Celdas
            max_height = this.getMaxHeight(row);
            for (let e in row) {

                const cell = row[e];
                if (y + max_height > this.pdf.doc.page.height - 50) {
                    this.pdf.addPage();
                    y = this.pdf.doc.page.margins.top;
                }

                if (i == 0) {
                    this.pdf.doc.rect(x, y, cell.width, max_height + 8).fillAndStroke("#2358B8", "#000");
                    this.pdf.doc.fillColor("#fff");
                } else {
                    this.pdf.doc.rect(x, y, cell.width, max_height + 8).fillAndStroke("#fff", "#000");
                    this.pdf.doc.fillColor("#000");
                }
                const text = this.pdf.doc.text(cell.text, x + 5, y + 8, { width: cell.width - 10 });

                if (this.init.page != this.pdf.pageCount) {
                    // this.pdf.doc.switchToPage(1);
                    this.init.page = this.pdf.pageCount;
                    y = this.pdf.doc.page.margins.top;;
                }
                x += cell.width;
            }

            y += max_height + 8;
        }
    }
}

module.exports = (pdf) => new PDFTable(pdf);