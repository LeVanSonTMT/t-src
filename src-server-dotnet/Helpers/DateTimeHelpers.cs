using TimeZoneConverter;
using MyApiDotnet8.Commons.Constants;

namespace MyApiDotnet8.Helpers
{
    public static class DateTimeHelpers
    {
        public static long Timestamp(this DateTime date)
        {
            DateTimeOffset do1 = new(date.Year, date.Month, date.Day, date.Hour, date.Minute, date.Second, new TimeSpan(+7, 0, 0));
            return do1.ToUnixTimeSeconds();
        }

        public static DateTime Now()
        {
            TimeZoneInfo tzi = TZConvert.GetTimeZoneInfo(Constants.TIME_ZONE);
            DateTime asiaTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, tzi); // convert from utc to local
            return asiaTime;
        }

        public static DateTimeOffset TimeStampToDate(long unixTimeStamp)
        {
            // Unix timestamp is seconds past epoch
            DateTimeOffset dateTimeOffset = DateTimeOffset.FromUnixTimeSeconds(unixTimeStamp);
            DateTimeOffset localtime = TimeZoneInfo.ConvertTime(dateTimeOffset, TZConvert.GetTimeZoneInfo(Constants.TIME_ZONE));
            return localtime;
        }

        public static long DateToTimeStamp(DateTime dateTime)
        {
            DateTimeOffset do1 = new(dateTime.Year, dateTime.Month, dateTime.Day, dateTime.Hour, dateTime.Minute, dateTime.Second, new TimeSpan(+7, 0, 0));
            return do1.ToUnixTimeSeconds();
        }

        public static string UnixTimeToCorrectFormat(long unixTimeStamp, string format)
        {
            DateTimeOffset dateTimeOffset = DateTimeOffset.FromUnixTimeSeconds(unixTimeStamp);
            DateTimeOffset localtime = TimeZoneInfo.ConvertTime(dateTimeOffset, TZConvert.GetTimeZoneInfo(Constants.TIME_ZONE));
            return localtime.ToString(format);
        }

        public static long NowTimeStamp()
        {
            return DateTimeOffset.Now.ToUnixTimeSeconds();
        }
    }
}
