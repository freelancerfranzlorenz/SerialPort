class SerialPort
{
   constructor() 
   {  this.Port = null;
      this.aBaudrates = [ 110, 300, 600, 1200, 2400, 4800, 9600, 14400, 19200, 38400, 57600, 115200, 128000, 256000 ];
      this.Settings = { baudRate:9600, dataBits:8, stopBits:1, parity:"none", bufferSize:255, flowControl:"none" };
      this.sLineEnd = "\n"; this.sRxBuffer = ""; this.Reader = null; this.keepReading = true;
   }
   setDataBits7()          { this.Settings.dataBits = 7; }
   setDataBits8()          { this.Settings.dataBits = 8; }
   setStopBits1()          { this.Settings.stopBits = 1; }
   setStopBits2()          { this.Settings.stopBits = 2; }
   setParityNone()         { this.Settings.parity = "none"; }
   setParityEven()         { this.Settings.parity = "even"; }
   setParityOdd()          { this.Settings.parity = "odd"; }
   setBufferSize( nBytes ) { this.Settings.bufferSize = nBytes; }
   setFlowCtrlNone()       { this.Settings.flowControl = "none"; }
   setFlowCtrlHardware()   { this.Settings.flowControl = "hardware"; }
   setLineEnd( sLineEnd )  { this.sLineEnd = sLineEnd; }
   setBaudrate( nBaud )
   {  let bRet = false;
      if( this.aBaudrates.indexOf( nBaud ) >= 0 )
      {  this.Settings.baudRate = nBaud;
         bRet = true;
      }
      return bRet;
   }

   isAvailable()
   {  return( "serial" in navigator );    }   

   isOpen()
   {  return( null != this.Port );  } 

   _buffer( sRx )
   {  this.sRxBuffer += sRx;
      let aRx = this.sRxBuffer.split( this.sLineEnd );
      while( aRx.length > 1 )
      {  this.callCallback( "read", aRx.shift() ); }
      this.sRxBuffer = aRx[0];
   }

   async open()
   {  try
      {  this.Port = await navigator.serial.requestPort();
         try
         {  await this.Port.open( this.Settings );
            this.callCallback( "open" );
            this.keepReading = true;
            this.sRxBuffer = "";
            while( this.Port.readable && this.keepReading )
            {  this.Reader = this.Port.readable.getReader();
               try 
               {  while( this.keepReading )
                  {
                     const { value, done } = await this.Reader.read();
                     if( done )  break;
                     if( value )
                     {  let sRx = new TextDecoder().decode( value );
                        if( this.sLineEnd.length > 0 )
                        { this._buffer( sRx ); } 
                        else 
                        { this.callCallback( "read", sRx ); }
                     }
                  }  //while()
               } 
               catch( error )
               {  }
               finally
               {  this.Reader.releaseLock(); }
            }
            await this.Port.close();
            this.Port = null;
            this.callCallback( "close" );
         }
         catch( error )
         {  this.callCallback( "error", "open" );  }
      }
      catch( error )
      {  this.callCallback( "break", "open" );
         this.Port = null;
      }
   }

   async write( sText )
   {
      if( null != this.Port )
      {  const writer = Serial.Port.writable.getWriter();
         await writer.write( new TextEncoder("utf-8").encode( sText ) );
         writer.releaseLock();
      }
      else
      {  callbackSerialPort( "error", "write" );   }
   }

   async writeln( sText )
   {  this.write( sText+this.sLineEnd ); } 

   async close()
   {  this.keepReading = false;
      this.Reader.releaseLock();
   }

   callCallback( sCmd, Data )
   {  if( typeof callbackSerialPort == 'function' )
      {  callbackSerialPort( sCmd, Data );   }
   }
};  
//class SerialPort
