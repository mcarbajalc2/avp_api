const { mPDF, options } = require('../libs/mpdf/mpdf');

const genPDF = (cotizacion, res) => {
    const pdf = new mPDF(`cotizacion-${cotizacion[0].id_cotizacion}.pdf`);

    pdf.addPage();

    pdf.image('server/images/cotizacion-header.png', 0, 0, {width: 308})

    const titleX = paintTitle(pdf, cotizacion)
    paintDestinatario(pdf, cotizacion)
    paintRemitente(pdf, cotizacion, titleX)
    paintTable(pdf, cotizacion)
    paintFooter(pdf, cotizacion)
    paintValidez(pdf)

    addCondiciones(pdf);

    pdf.download(res)
}

const addCondiciones = (pdf) => {
    pdf.addPage();
    pdf.image('server/images/cotizacion-header2.png', 0, 0, {width: 308})

    pdf.doc.moveDown();
    pdf.doc.moveDown();
    pdf.doc.moveDown();
    pdf.doc.moveDown();
    pdf.doc.moveDown();
    pdf.doc.moveDown();

    pdf.doc.fontSize(28);
    pdf.doc.fillColor('#89B836')
        .font('server/fonts/Roboto/Roboto-Black.ttf')
        .text('COTIZACIÓN', x, y, {width});
}

const paintValidez = (pdf) => {
    const y = pdf.doc.page.height - 130
    pdf.doc
        .fontSize(10)
        .fillColor('#89B836')
        .text('Terminos y Codiciones', 35, y)

    pdf.doc
        .fontSize(9)
        .font('server/fonts/Roboto/Roboto-Light.ttf')
        .fillColor('#000')
        .text('Todos los montos expresados en este documento están establecidos en Soles. Esta cotización es válida hasta 15 días despues de su fecha de emisión', 35, y + 15, {width: 600 - 70})
}

const paintDestinatario = (pdf, cotizacion) => {
    const y = 130

    pdf.doc.fontSize(10)
        .fillColor('#89B836')
        .font('server/fonts/Roboto/Roboto-Medium.ttf')
        .text('Destinatario:', 35, y)

    pdf.doc.fontSize(18)
        .fillColor('#000000')
        .text(`${cotizacion[0].contacto}.`, 35, y + 20, {lineBreak: false})

    pdf.doc.fontSize(9)
        .fillColor('#000000')
        .text(`${cotizacion[0].relacion}, ${cotizacion[0].razon_social}`, 35, y + 45)

    pdf.doc.fontSize(9)
        .fillColor('#000000')
        .text(`Teléfono: ${cotizacion[0].telefono}`, 35, y + 60)

    pdf.doc.fontSize(9)
        .fillColor('#000000')
        .text(`Email: ${cotizacion[0].email}`, 35, y + 75)

}

const paintRemitente = (pdf, cotizacion, titleX) => {
    const y = 130
    

    pdf.doc.fontSize(10)
        .fillColor('#89B836')
        .font('server/fonts/Roboto/Roboto-Medium.ttf')
        .text('Remitente:', titleX, y)

    pdf.doc.fontSize(18)

    const width = pdf.doc.widthOfString('Marcio Chumacero.')

    pdf.doc.fillColor('#000000')
        .text('Marcio Chumacero.', titleX, y + 20, {lineBreak: false})

    pdf.doc.fontSize(9)
        .fillColor('#000000')
        .text('Gerente General, AVP y Seguridad S.A.C.', titleX, y + 45, {lineBreak: false})

    pdf.doc.fontSize(9)
        .fillColor('#000000')
        .text('Teléfono: +51 942 865 646', titleX, y + 60)

    pdf.doc.fontSize(9)
        .fillColor('#000000')
        .text('Email: marcio.chumacero@avp.pe', titleX, y + 75)
}

const paintTable = (pdf, cotizacion) => {
    pdf.doc.moveDown()    
    pdf.doc.text('', 35)
    pdf.doc.moveDown()

    let y = pdf.doc.y
    const x = 34
    
    addCell(pdf, 'UBICACIÓN', {background: '#89B836', color: '#ffffff', width: 150, height: 35, x, y})
    addCell(pdf, 'DESC. PRODUCTO', {background: '#89B836', color: '#ffffff', width: 157, height: 35, x: x + 152, y})
    addCell(pdf, 'PRECIO', {background: '#2A3547', color: '#ffffff', align: 'center', width: 70, height: 35, x: x + 311, y})
    addCell(pdf, 'CANT.', {background: '#2A3547', color: '#ffffff', align: 'center', width: 70, height: 35, x: x + 383, y})
    addCell(pdf, 'IMPORTE', {background: '#2A3547', color: '#ffffff', align: 'center', width: 70, height: 35, x: x + 455, y})

    y = y + 38

    cotizacion.forEach((elm, idx) => {        
        let background = '#F6F7F9'

        if((idx + 1) % 2 === 0){
            background = '#ffffff'
        }

        addCell(pdf, elm.descripcion_ubicacion, {vertical: 'center', background, color: '#000', width: 150, height: 50, x, y})
        addCell(pdf, elm.descripcion, {title: elm.abreviatura, vertical: 'center', background, color: '#000', width: 157, height: 50, x: x + 152, y})
        addCell(pdf, `S/ ${elm.precio.toFixed(2)}`, {vertical: 'center', background, color: '#000', align: 'center', width: 70, height: 50, x: x + 311, y})
        addCell(pdf, `${elm.cantidad}`, {vertical: 'center', background, color: '#000', align: 'center', width: 70, height: 50, x: x + 383, y})
        addCell(pdf, `S/ ${elm.importe.toFixed(2)}`, {vertical: 'center', background, color: '#000', align: 'center', width: 70, height: 50, x: x + 455, y})

        y = y + 53
    })

    const subtotal = cotizacion.reduce((A, B) => A + B.importe, 0)
    const subtotal_str = `S/ ${subtotal.toFixed(2)}`

    const igv = subtotal * 0.18
    const igv_str = `S/ ${igv.toFixed(2)}`

    const total = subtotal * 1.18
    const total_str = `S/ ${total.toFixed(2)}`

    pdf.doc.text('SubTotal:', x + 323, y + 15)
    pdf.doc.text(subtotal_str, 547 - pdf.doc.widthOfString(subtotal_str) , y + 15, {lineBreak: false})

    pdf.doc.text('I.G.V.:', x + 323, y + 30)
    pdf.doc.text(igv_str, 547 - pdf.doc.widthOfString(igv_str) , y + 30, {lineBreak: false})

    pdf.doc.rect(x + 311, y + 55, 70 * 3 + 6, 35)
        .fillAndStroke('#89B836', "#fff")

    pdf.doc.fillColor('#ffffff');
    pdf.doc.text('Total:', x + 323, y + 67)

    pdf.doc.text(total_str, 547 - pdf.doc.widthOfString(total_str), y + 67, {lineBreak: false})
}

const addCell = (pdf, text, options) => {    

    pdf.doc.rect(options.x, options.y, options.width, options.height)
        .fillAndStroke(options.background, "#fff");

    let x = options.x + 12
    let y = options.y
    let lineBreak = false
    let width = undefined
    let title_height = 0
    
    if(options.align && options.align === 'center'){
        const width_aux = pdf.doc.widthOfString(text)
        x = options.x + (options.width / 2) - width_aux / 2
    }

    if(options.vertical && options.vertical == 'center'){        
        const width_aux = pdf.doc.widthOfString(text)
        const height = pdf.doc.heightOfString(text, { width: options.width - 24})        

        y = (options.y - 14) + (options.height / 2) - (height / 2)        

        if(width_aux >= options.width - 24){            
            lineBreak = true
            width = options.width - 24
        }
    }

    if(options.title){
        title_height = pdf.doc.heightOfString(options.title, { width: options.width - 24})
        pdf.doc.fillColor(options.color)
            .text(options.title, x, y + 10, {lineBreak: false})
        y += 7
        pdf.doc.font('server/fonts/Roboto/Roboto-Light.ttf')
    }
    
    pdf.doc.fillColor(options.color)
        .text(text, x, y + 13, {lineBreak, width})

    if(options.title){
        pdf.doc.font('server/fonts/Roboto/Roboto-Medium.ttf')
    }
    
}

const paintFooter = (pdf, cotizacion) => {
    pdf.image('server/images/cotizacion-footer.png', 0, pdf.doc.page.height - 60, {width: 600})
}


const paintTitle = (pdf, cotizacion) => {
    pdf.doc.fontSize(28)
    const width = pdf.doc.widthOfString('COTIZACIÓN')
    const x = (600 - width - 35)
    const y = 30

    pdf.doc.fillColor('#89B836')
        .font('server/fonts/Roboto/Roboto-Black.ttf')
        .text('COTIZACIÓN', x, y, {width})

    pdf.doc.fontSize(10)
        .fillColor('#000')
        .font('server/fonts/Roboto/Roboto-Medium.ttf')
        .text('Código:', x, y + 35, {})
    
    pdf.doc.fontSize(10)
        .fillColor('#000')
        .font('server/fonts/Roboto/Roboto-Medium.ttf')
        .text('Fecha:', x, y + 50, {})

    const codigo = `#${cotizacion[0].id_cotizacion}`
    const codigo_width = pdf.doc.widthOfString(codigo)
    
    pdf.doc.fontSize(10)
        .fillColor('#000')
        .font('server/fonts/Roboto/Roboto-Regular.ttf')
        .text(codigo, (595 - codigo_width - 35), y + 35, {width: codigo_width})  

    const fecha = `${cotizacion[0].fecha}`
    const fecha_width = pdf.doc.widthOfString(fecha)
    
    pdf.doc.fontSize(10)
        .fillColor('#000')
        .font('server/fonts/Roboto/Roboto-Regular.ttf')
        .text(fecha, (595 - fecha_width - 35), y + 50, {width: fecha_width})  

    return x
}

module.exports = { genPDF }