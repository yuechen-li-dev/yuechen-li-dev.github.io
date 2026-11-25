function Details(title: string): Document {
    return <Document>
        <Heading level="2">Article details</Heading>
        <Paragraph>{title}</Paragraph>
    </Document>;
}

export function View(status: string, title: string): Document {
    if (title != "") { return Details(title); }
    return <Document>
        <Heading level="2">Article details</Heading>
        <Paragraph>{status}</Paragraph>
    </Document>;
}
