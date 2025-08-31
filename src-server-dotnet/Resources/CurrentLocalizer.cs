using Microsoft.Extensions.Localization;
using System.Reflection;

namespace MyApiDotnet8.Resources
{
    public class CurrentLocalizer
    {
        private readonly IStringLocalizer _localizer;

        public CurrentLocalizer(IStringLocalizerFactory factory)
        {
            var type = typeof(CurrentResource);
            var assemblyName = new AssemblyName(type.GetTypeInfo().Assembly.FullName);
            _localizer = factory.Create("Resources.CurrentResource", assemblyName.FullName);
        }

        private LocalizedString GetLocalizedHtmlString(string key)
        {
            return _localizer[key];
        }

        public LocalizedString this[string key]
        {
            get
            {
                return GetLocalizedHtmlString(key);
            }
        }

        public LocalizedString this[string key, params object[] arguments]
        {
            get
            {
                return _localizer[key, arguments];
            }
        }
    }
}
