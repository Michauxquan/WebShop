using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Web;
using System.Web.Mvc; 
using ProBusiness;
using ProTools;

namespace Proc.Common
{
    public class ApiAuthorize : AuthorizeAttribute
    {
        //public static string AppKey = ProTools.Common.GetKeyValue("MobileAppKey"); 
        //public static string AppSecret = ProTools.Common.GetKeyValue("MobileAppSecret"); 
        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            //string signature = HttpContext.Current.Request["signature"];
            //string userID = HttpContext.Current.Request["account"];

            //if (!string.IsNullOrEmpty(signature) && !string.IsNullOrEmpty(userID))
            //{
            //    if (signature.Equals(Signature.GetSignature(AppKey, AppSecret, userID), StringComparison.OrdinalIgnoreCase))
            //    {
                    return true;
            //    }

            //}

            //httpContext.Response.StatusCode = 401;
            //return false;
        }

        public override void OnAuthorization(AuthorizationContext filterContext)
        { 

            ControllerBase ctb = filterContext.Controller;
            if (filterContext.HttpContext.Response.StatusCode == 401)
            {
                filterContext.Result = ResultAPI.apiresult.APIResult("error", "用户签名不正确!");
                return;
            }
          
            string result = WebHelper.GetPostStr();
            List<string> actionlist;
            if (!WebHelper.IsPost())
            {
                actionlist = new List<string>();
                actionlist.AddRange(new string[]
                {
                   "getsigna", "newly","daily"
                }); 
                if (!ctb.ToString().Contains("ErrorController") &&
                    !actionlist.Contains(filterContext.ActionDescriptor.ActionName.ToLower()))
                {
                    filterContext.Result = ResultAPI.apiresult.APIResult("error", "只支持POST方式请求");
                    return;
                }
            }
            else
            { 
                NameValueCollection parmas = PostParams.StrParams.strparams;
                string tempreulst = "";
                parmas.AllKeys.ToList().ForEach(x =>
                {
                    tempreulst += x + ":" + parmas[x] + ",";
                });

                string appkey = parmas.Get("appkey") == null ? filterContext.HttpContext.Request.Form["appkey"] : parmas.Get("appkey");
                actionlist = new List<string>();
                actionlist.AddRange(new string[]
                {
                   "getsigna", "openresult" 
                });
                //验证IMEI
                if (!actionlist.Contains(filterContext.ActionDescriptor.ActionName.ToLower()))
                {
                    if ((parmas.Get("appkey") == null || parmas.Get("appsecret") == null) &&
                        (filterContext.HttpContext.Request.Form["appkey"] == null || filterContext.HttpContext.Request.Form["appsecret"] == null))
                    {
                        filterContext.Result = ResultAPI.apiresult.APIResult("error", "缺少请求参数");
                        return;
                    }

                    string appsecret = filterContext.HttpContext.Request.Form["appsecret"] ?? parmas.Get("appsecret");
                    string imres = M_UsersBusiness.ValidateAPPKey(appkey, appsecret);
                    if (imres != string.Empty)
                    {
                        filterContext.Result = ResultAPI.apiresult.APIResult("error", imres);
                        return;
                    }
                }
            }

        }


    }

    public class PostParams
    {
        public static PostParams StrParams=new PostParams(); 
        public NameValueCollection strparams { get; set; }
    }

}