using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;

namespace ProTools
{
    public class AppConfig
    {
        public static string AppUrl = System.Configuration.ConfigurationManager.AppSettings["AppUrl"] ?? "http://t.apiplus.cn/";
        public static string AppKey = System.Configuration.ConfigurationManager.AppSettings["AppKey"] ?? ""; 
    } 
    public enum KCWAppUrl
    {
        [Description("newly.do")]
        NewLy,
        [Description("daily.do")]
        Daily ,
        [Description("curly.do")]
        Curly
    }
}
