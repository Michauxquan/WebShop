using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ProBusiness;
using ProTools;

namespace Proc.Areas.API.Controllers
{
    public class OpenResultController : BaseAPIController
    {
        //
        // POST: /API/OpenReslut/
        /// <summary>
        /// 添加开奖
        /// </summary>
        /// <returns></returns>
        //[HttpGet]
        //public ActionResult OpenResult()
        //{
        //    bool result=LotteryResultBusiness.OpenResult(parmas["result"], parmas["issuenum"], parmas["cpcode"]);
        //    return APIResult(result ? "success" : "error", "执行成功");
        //} 
        public ActionResult OpenResult()
        {
            bool result = LotteryResultBusiness.OpenResult(parmas["result"], parmas["issuenum"], parmas["cpcode"]);
            return APIResult(result ? "success" : "error", parmas["cpcode"] + "第" + parmas["issuenum"] + "期开奖结果" + parmas["result"]+".插入数据" + (result ? "执行成功" : "执行失败"));
        }
    }
}
