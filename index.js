document.addEventListener('DOMContentLoaded', () => {
    if ("serial" in navigator) {
        let changeBtn = document.getElementById('changeBtn');
        let menuBtn = document.getElementById('menuBtn');
        let logText = document.getElementById('textLog');
        changeBtn.style.display = 'none';
        menuBtn.addEventListener('click', () => {
            changeBtn.style.display = 'block';
            menuBtn.style.display = 'none';
            document.getElementById('gif').style.display = 'none';
        })
        changeBtn.addEventListener('click', async (e) => {
            let port
            let deviceInfo = prompt('Enter Region. Example: XXV').toUpperCase()
            let arr = ["AT+SWATD=0\r\n","AT+ACTIVATE=0,0,0\r\n","AT+SWATD=1\r\n",`AT+PRECONFG=2,${deviceInfo}\r
`,"AT+CFUN=1,1\r\n"]
            try {
                port = await navigator.serial.requestPort();
            }
            catch (e) {
                window.location.reload()
            }
            console.log(port);
            await port.open({ baudRate: 9600 });
            const textEncoder = new TextEncoderStream();
            const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);

            const writer = textEncoder.writable.getWriter();

            const reader = port.readable.getReader();
            logText.innerText = "Changing region... Please wait and don't close your page and don" +
                "t disconnect your phone\n"
            async function writeToSerial(i) {
                if (i < arr.length) {
                    setTimeout(async () => {
                        await writer.write(arr[i]);
                        i++
                        await writeToSerial(i);
                    },10000)
                }
                const { value, done } = await reader.read();
                if (done) {
                    reader.releaseLock();
                }
                let serialLog = new TextDecoder().decode(value)

                logText.innerText += serialLog + "\n";

                if (serialLog.includes("")) {}
            }
            await writeToSerial(0)
        })
    }
    else {
        document.getElementById('changeBtn').style.display = 'none';
        document.getElementById('menuBtn').style.display = 'none';
        document.getElementById('textLog').style.display = 'none';
        document.getElementById('gif').style.display = 'none';
        document.getElementById('wlcm').innerText = "YOUR BROWSER IS NOT SUPPORTED! USE CHROME OR MICROSOFT EDGE"
    }
})
