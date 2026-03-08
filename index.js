document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('changeBtn').style.display = 'none';
    document.getElementById('menuBtn').addEventListener('click', () => {
        document.getElementById('changeBtn').style.display = 'block';
        document.getElementById('menuBtn').style.display = 'none';
        document.getElementById('gif').style.display = 'none';
    })
    document.getElementById('changeBtn').addEventListener('click', async (e) => {
        let deviceInfo = prompt('Enter Region. Example: XXV').toUpperCase()
        let arr = ["AT+SWATD=0\r\n","AT+ACTIVATE=0,0,0\r\n","AT+SWATD=1\r\n",`AT+PRECONFG=2,${deviceInfo}\r
`,"AT+CFUN=1,1\r\n"]
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 });
        const textEncoder = new TextEncoderStream();
        const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);

        const writer = textEncoder.writable.getWriter();

        console.log(port)
        const reader = port.readable.getReader();
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
            console.log(new TextDecoder().decode(value));
        }
        await writeToSerial(0)
    })
})
