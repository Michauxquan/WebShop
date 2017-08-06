using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Proc.Common;
using ProTools;

namespace Proc.Areas.API.Controllers
{
    [Proc.Common.ApiAuthorize]
    public class BaseAPIController : Controller
    {
        //
        // GET: /API/BaseAPI/ 
        public NameValueCollection parmas;
        protected override void Initialize(System.Web.Routing.RequestContext requestContext)
        {
            PostParams.StrParams.strparams = WebHelper.GetParmList(WebHelper.GetPostStr());
            parmas = PostParams.StrParams.strparams;
            base.Initialize(requestContext);
        }
        /// <summary>
        /// 返回数据集合
        /// </summary>
        protected Dictionary<string, object> JsonDictionary = new Dictionary<string, object>();

        protected int PageSize = 20;

        protected string OperateIP
        {
            get
            {
                return string.IsNullOrEmpty(Request.Headers.Get("X-Real-IP")) ? Request.UserHostAddress : Request.Headers["X-Real-IP"];
            }
        } 
       public ActionResult APIResult(string state, string biz_content, bool isObject = false)
       {
           return ResultAPI.apiresult.APIResult(state, biz_content, isObject);
       }
       public ActionResult APIResult(string state, string biz_content, bool isObject, string keyname, string keyvalue)
       {
           return ResultAPI.apiresult.APIResult(state,biz_content,isObject, keyname, keyvalue);
       }
    }
    
}
