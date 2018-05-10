/**
 * Copyright 2009 (c) , Brooks Andrus
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * 
 */

export class ISO8601Util
{
    private static DASH:string  = "-";
    private static PERIOD:string = ".";
    private static COLON:string = ":";
    private static ZULU:string  = "Z";
    private static T:string     = "T";
    private static ZERO:string  = "0";
    
    /**
     * Converts an AS3 Date object into an ISO-8601 UTC extended date and time string (YYYY-MM-HHTHH:MM:SSZ).
     * The zulu designation (Z) at the end of the string indicates the time is UTC (Coordinated Universal Time).
     */
    public static formatExtendedDateTime( date:Date ):string
    {
        return ISO8601Util.formatExtendedDate( date )
        + ISO8601Util.T
            + ISO8601Util.formatExtendedTime( date )
            + ISO8601Util.ZULU;
    }
    
    /**
     * Converts an AS3 Date object into an ISO-8601 UTC basic date and time string. The Basic format has no hyphens or 
     * colons, but does have a UTC zulu designation at the end.
     */
    public static formatBasicDateTime( date:Date ):string
    {
        return ISO8601Util.formatBasicDate( date )
        + ISO8601Util.T
            + ISO8601Util.formatBasicTime( date )
            + ISO8601Util.ZULU;
    }
    
    /**
     * converts an ISO-8601 date + time (UTC) string of format "2009-02-21T09:00:00Z" to an AS3 Date Object.
     * The zulu designation (Z) at the end of the string indicates the time is UTC (Coordinated Universal Time).
     * Even if the zulu designation is missing UTC will be assumed.
     */
    public static parseDateTimeString( val:string ):Date
    {
        if (val == null || val == "")
        {
            return null;
        }
        //first strip all non-numerals from the string ( convert all extended dates to basic)
        val = val.replace( /-|:|T|Z|\./g, "" );
        
        var date:Date = ISO8601Util.parseBasicDate( val.substr( 0, 8 ) );
        date = ISO8601Util.parseBasicTime( val.substr( 8, 9 ), date );
        
        return date;
    }
    
    public static parseBasicDate( val:string, date:Date = null ):Date
    {
        if ( date == null )
        {
            date = new Date();
        }
        
        date.setUTCFullYear( ISO8601Util.convertYear( val ), ISO8601Util.convertMonth( val ), ISO8601Util.convertDate( val ) );
        
        return date;
    }
    
    public static parseBasicTime( val:string, date:Date = null ):Date
    {
        if ( date == null )
        {
            date = new Date();
        }
        
        date.setUTCHours( ISO8601Util.convertHours( val ), ISO8601Util.convertMinutes( val ), ISO8601Util.convertSeconds( val ), ISO8601Util.convertMiliSeconds( val ) );
        
        return date;
    }
    
    public static formatExtendedDate( date:Date ):string
    {
        return ISO8601Util.formatYear( date.getUTCFullYear() )
        + ISO8601Util.DASH 
            + ISO8601Util.formatMonth( date.getUTCMonth() )
            + ISO8601Util.DASH
            + ISO8601Util.formatDate( date.getUTCDate() )
    }
    
    public static formatBasicDate( date:Date ):string
    {
        return ISO8601Util.formatYear( date.getUTCFullYear() )
        + ISO8601Util.formatMonth( date.getUTCMonth() )
            + ISO8601Util.formatDate( date.getUTCDate() );
    }
    
    public static formatExtendedTime( date:Date ):string
    {
        return ISO8601Util.formatTimeChunk( date.getUTCHours() )
        + ISO8601Util.COLON
            + ISO8601Util.formatTimeChunk( date.getUTCMinutes() )
            + ISO8601Util.COLON
            + ISO8601Util.formatTimeChunk( date.getUTCSeconds() ) 
            + ISO8601Util.PERIOD
            + ISO8601Util.formatTimeChunk(date.getUTCMilliseconds(), 3);
    }
    
    public static formatBasicTime( date:Date ):string
    {
        return ISO8601Util.formatTimeChunk( date.getUTCHours() )
        + ISO8601Util.formatTimeChunk( date.getUTCMinutes() )
            + ISO8601Util.formatTimeChunk( date.getUTCSeconds() );
    }
    
    /**
     * assumes an 8601 basic date string (8 characters YYYYMMDD)
     */
    private static convertYear( val:string ):number
    {
        val = val.substr( 0, 4 );
        return parseInt( val );
    }
    
    /**
     * assumes an 8601 basic date string (8 characters YYYYMMDD)
     */
    private static convertMonth( val:string ):number
    {
        val = val.substr( 4, 2 );
        var y:number = parseInt( val ) - 1; // months are zero indexed in Date objects so we need to decrement
        return y;
    }
    
    /**
     * assumes an 8601 basic date string (8 characters YYYYMMDD)
     */
    private static convertDate( val:string ):number
    {
        val = val.substr( 6, 2 );
        
        return parseInt( val );
    }
    
    /**
     * assumes a 8601 basic UTC time string (6 characters HHMMSS)
     */
    private static convertHours( val:string ):number
    {
        val = val.substr( 0, 2 );
        
        return parseInt( val );
    }
    
    /**
     * assumes a 8601 basic UTC time string (6 characters HHMMSS)
     */
    private static convertMinutes( val:string ):number
    {
        val = val.substr( 2, 2 );
        
        return parseInt( val );
    }
    
    /**
     * assumes a 8601 basic UTC time string (6 characters HHMMSS)
     */
    private static convertSeconds( val:string ):number
    {
        val = val.substr( 4, 2 );
        
        return parseInt( val );
    }
    
    private static convertMiliSeconds( val:string ):number
    {
        var retVal:number = 0;
        if(val.length >= 7)
        {
            val = val.substr( 6, 3 );
            retVal = parseInt( val );    
        }

        return retVal;
    }
    
    // doesn't handle BC dates
    private static formatYear( year:number ):string
    {
        var y:string = year.toString();
        // 0009 0010 0099 0100
        if ( year < 10 )
        {
            y = ISO8601Util.ZERO + ISO8601Util.ZERO + ISO8601Util.ZERO + y;
        }
        else if ( year < 100 )
        {
            y = ISO8601Util.ZERO + ISO8601Util.ZERO + y;
        }
        else if ( year < 1000 )
        {
            y = ISO8601Util.ZERO + y;
        }
        
        return y;
    }
    
    private static formatMonth( month:number ):string
    {
        // Date object months are zero indexed so always increment the month up by one
        month++;
        
        // convert the month to a string
        var m:string = month.toString();
        
        if ( month < 10 )
        {
            m = ISO8601Util.ZERO + m; 
        }
        
        return m;
    }
    
    private static formatDate( date:number ):string
    {
        var d:string = date.toString()
        if ( date < 10 )
        {
            d = ISO8601Util.ZERO + d;
        }
        
        return d;
    }
    
    private static formatTimeChunk( val:number, digits:number=2 ):string
    {
        var t:string = val.toString();
        
        while ( t.length < digits )
        {
            t = ISO8601Util.ZERO + t;
        }
        
        return t;
    }
}