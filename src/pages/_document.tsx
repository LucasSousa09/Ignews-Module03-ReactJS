import Document, { Html, Head, Main, NextScript } from 'next/document'


export default class MyDocument extends Document{
    render() {
        return (
            <Html>
                <Head>
                    <meta property='og:title' content='ig.news' />
                    <meta
                    property='og:description'
                    content='Notícias sobre ReactJS'
                    />
                    <meta property='og:url' content='https://ignews-coral-gamma.vercel.app/' />
                    <meta property='og:type' content='website' />
                    <meta property="og:image" content="images/ignews.png"/>
                    <link rel="preconnect" href="https://fonts.googleapis.com"/>
                    <link rel="preconnect" href="https://fonts.gstatic.com" />
                    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap" rel="stylesheet" />
                    <link rel="shortcut icon" href="favicon.png" type="image/png" />
                </Head>
                <body>
                    <Main/>
                    <NextScript />
                </body>
            </Html>
        )
    }
}