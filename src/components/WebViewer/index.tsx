import React, {useRef} from 'react';
import WebView from 'react-native-webview';

const WebViewer = ({
    html = '',
    style,
    containerStyle,
}: {
    html: string;
    style?: object;
    containerStyle?: object;
}) => {
    const webview = useRef<any>(null);
    const _html = `<html><meta name="viewport" content="width=device-width, initial-scale=1">
                     <body>${html}</body>
                  </html>`;

    return (
        <WebView
            ref={webview}
            style={style}
            containerStyle={containerStyle}
            scalesPageToFit={false}
            originWhitelist={['*']}
            showsVerticalScrollIndicator={false}
            source={{html: _html}}
        />
    );
};

export default WebViewer;
