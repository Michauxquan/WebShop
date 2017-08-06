
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Proc.Controllers
{
    [Proc.Common.UserAuthorize]
    public class BaseController : Controller
    { 

        protected int PageSize = 20;

        protected Dictionary<string, object> JsonDictionary = new Dictionary<string, object>();

        /// <summary>
        /// 登录IP
        /// </summary>
        protected string OperateIP
        {
            get
            {
                return string.IsNullOrEmpty(Request.Headers.Get("X-Real-IP")) ? Request.UserHostAddress : Request.Headers["X-Real-IP"];
            }
        }

        protected ProEntity.Manage.M_Users CurrentUser
        {
            get
            {
                if (Session["CPAPIManager"] == null)
                {
                    return null;
                }
                else
                {
                    return (ProEntity.Manage.M_Users)Session["CPAPIManager"];
                }
            }
            set { Session["CPAPIManager"] = value; }
        }
        /// <summary>
        /// 是否有权限
        /// </summary>
        public  bool IsLimits(string menucode)
        {
            if (Session["CPAPIManager"] != null)
            {
                ProEntity.Manage.M_Users model = (ProEntity.Manage.M_Users)Session["ZPYManager"];
                if (model.Menus.Where(m => m.MenuCode == menucode).Count() > 0)
                {
                    return true;
                }
            }
            return false;
        } 
    }
}
