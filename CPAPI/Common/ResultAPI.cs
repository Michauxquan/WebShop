using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Proc.Common
{
    public class ResultAPI:Controller
    {
        public static ResultAPI apiresult=new ResultAPI();
        /// <summary>
        /// ajax请求结果
        /// </summary>
        /// <param name="state">状态</param>
        /// <param name="content">内容</param>
        /// <returns></returns>
        public ActionResult AjaxResult(string state, string content)
        {
            return AjaxResult(state, content, false);
        }

        /// <summary>
        /// ajax请求结果
        /// </summary>
        /// <param name="state">状态</param>
        /// <param name="content">内容</param>
        /// <param name="isObject">是否为对象</param>
        /// <returns></returns>
        public ActionResult AjaxResult(string state, string content, bool isObject)
        {
            return Content(string.Format("{0}\"state\":\"{1}\",\"content\":{2}{3}{4}{5}", "{", state, isObject ? "" : "\"", content, isObject ? "" : "\"", "}"));
        }

        /// <summary>
        /// 接口请求结果
        /// </summary>
        /// <param name="state">状态</param>
        /// <param name="biz_content">内容</param>
        /// <returns></returns>
        public ActionResult APIResult(string state, string biz_content)
        {
            return APIResult(state, biz_content, false);
        }
        /// <summary>
        /// 接口请求结果
        /// </summary>
        /// <param name="state">状态</param>
        /// <param name="biz_content">内容</param>
        /// <param name="isObject">是否为对象</param>
        /// <returns></returns>
        public ActionResult APIResult(string state, string biz_content, bool isObject)
        {
            return Content(string.Format("{0}\"state\":\"{1}\",\"biz_content\":{2}{3}{4}{5}", "{", state, isObject ? "" : "\"", biz_content, isObject ? "" : "\"", "}"));
        }
        public ActionResult APIResult(string state, string biz_content, bool isObject, string keyname, string keyvalue)
        {
            return Content(string.Format("{0}\"state\":\"{1}\",\"biz_content\":{2}{3}{4},\"{6}\":\"{7}\"{5}", "{", state, isObject ? "" : "\"", biz_content, isObject ? "" : "\"", "}", keyname, keyvalue));
        }
    }
}