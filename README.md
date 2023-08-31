# SerialPort
Javascript class for easy integration of the webapi interface Serial

# Usage

## How to add into your code
```
// include the class SerialPort source code
<script src='./SerialPort.js'></script>
...
<script>
// derive class from SerialPort
var Serial = new SerialPort();

// declare callback function of class SerialPort
function callbackSerialPort( sCmd, Data )
{  
   // add here your application code
   // evaluate sCmd and the additional data in Data
}

// first - check if your browser supports serial interfaces
if( ! Serial.isAvailable() ) 
   alert( "Browser does not support serial interfaces!" );

</script>
```	

## The global callback Function - <i>callbackSerialPort( sCmd, Data )</i>
The callback function <i>callbackSerialPort( sCmd, Data )</i> is called on any 
event, error or status-change from inside the class SerialPort.<br/>
If the callback function is not declared, then the class also works and it is
possible to send data, but you can not receive any characters.<br/>

| sCmd  | Data | Description |
| ----- | ---- | ------------ |
| "open" | <i>none</i> | The user has selected a serial interface and it is opened by the browser |
| "break" | "open" | The user breaks the selection of the serial interface |
| "error" | "open" | An error occured, when opening the serial interface |
| "error" | "write" | An error occured, when transmitting data to the serial interface |
| "close" | <i>none</i> | The serial interface is closed |
| "read" | <i>String</i> | The data <i>String</i> are received from the serial interface |


## API
The following functions are available in the class SerialPort:
### setDataBits7()
Sets the number of databits per byte to 7 bits.
### setDataBits8()
Sets the number of databits per byte to 8 bits (default).
### setStopBits1()
Sets the number of stopbits per byte to 1 bits (default).
### setStopBits2()
Sets the number of stopbits per byte to 2 bits.
### setParityNone()
Sets sending no parity bit (default).
### setParityEven()
Sets sending of an EVEN parity bit.
### setParityOdd() 
Sets sending of an ODD parity bit.
### setBufferSize( nBytes )
Sets the number of byte in the receive/transmit buffer. Default is 255.
### setFlowCtrlNone()
Disables the flow control (default).
### setFlowCtrlHardware()
Sets the flow control to "hardware" with the signals RTS/CTS.
### setLineEnd( sLineEnd )
Sets the line-end character. Default is '\n'.
### boolean setBaudrate( nBaud )
Sets the baudrate to the value <i>nBaud</i> - default 9600 bits/s.<br/>
The function returns 'true', if the baudrate is supported. Otherwise the function returns 'false'.<br/>
The available baudrates are: 110, 300, 600, 1200, 2400, 4800, 9600, 14400, 19200, 38400, 57600, 115200, 128000, 256000 bits/s.
### boolean isAvailable()
Returns 'true' if the browser supports the webapi interface 'serial'. If not, the function returns 'false'.<br/>
The first action you should do, when using this class is to check if this function returns 'true'.
### open()
Opens a serial interface on the local computer. After calling this function, a dialog on browser opens and the
user has to select a serial interface or can break the selection dialog. In any case, the callback function is 
called - please see callback function.
### boolean isOpen()
Returns 'true' if the serial interface is available and opened by the api function <i>open()</i>.
### write( <i>String</i> )
Transmits a string to the opened serial interface.
### writeln( <i>String</i> )
Transmits a string with the additional <b>line-end</b> character(s) (see function <i>setLineEnd()</i>).
### close()
Closes a open serial interface.

 

