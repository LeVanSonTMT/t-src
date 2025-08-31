using System.Collections;

namespace MyApiDotnet8.Helpers
{
    public static class StringHelpers
    {
        public static bool IsNullOrEmpty(object? value)
        {
            if (value == null){
                return true;
            }else{
                switch (value)
                {
                    case string str:
                        return string.IsNullOrWhiteSpace(str);

                    case IDictionary dict:
                        return dict.Count == 0;

                    case ICollection collection:
                        return collection.Count == 0;

                    case IEnumerable enumerable:
                        return !enumerable.Cast<object>().Any();

                    case DateTime dt:
                        return dt == default;

                    default:
                        return false;
                }
            }
        }

        public static string GenerateId()
        {
            var dateNow = DateTimeHelpers.Timestamp(DateTimeHelpers.Now());
            var random = new Random().Next(1000, 10000);
            return $"000{dateNow}{random}";
        }

        // public static long GenerateId()
        // {
        //     var dateNow = DateTimeHelpers.Timestamp(DateTimeHelpers.Now()); // 13
        //     var random = new Random().Next(1000, 1000); // 3
        //     return dateNow + random;
        // }

    }
}
