using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ProBusiness;
using ProBusiness.UserAttrs;

namespace CPiao.Controllers
{
    [CPiao.Common.UserAuthorize]
    public class ReportController : BaseController
    {
        //
        // GET: /Report/

        public ActionResult ReportList()
        {
            return View();
        }

        public ActionResult ReportSee()
        {
            return View();
        }

        public ActionResult ReportToday()
        {
            ViewBag.UserName = CurrentUser.UserName;
            ViewBag.LogName = CurrentUser.LoginName;
            var model=LotteryOrderBusiness.GetUserWinDay(CurrentUser.UserID);
            ViewBag.TotalPayMent = model.TotalPayMent == -1 ? 0 : model.TotalPayMent;
            ViewBag.TotalWin = model.TotalWin == -1 ? 0 : model.TotalWin;
            return View();
        }

        public ActionResult ReportProfit()
        {
            return View();
        }
        #region Ajax

        public JsonResult GetUserReport(string btime, string etime, int pageIndex)
        {
            int total = 0;
            int pageTotal = 0;
            var list = UserReportBussiness.GetReportList(btime, etime, CurrentUser.UserID, pageIndex, PageSize,
                ref total, ref pageTotal);
            JsonDictionary.Add("items", list);
            JsonDictionary.Add("totalCount", total);
            JsonDictionary.Add("pageCount", pageTotal);
            return new JsonResult()
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetLotteryOrderReportList(string btime, string etime, int playtype, string cpcode,
            string lcode, string issuenum, string type, string state, int winType, int pageIndex, int selfrange = 0)
        {
            int total = 0;
            int pageTotal = 0;
            var list = UserReportBussiness.GetLotteryOrderReportList(btime, etime, playtype, cpcode, CurrentUser.UserID, lcode, issuenum,type,state,winType,pageIndex, PageSize,
                ref total, ref pageTotal, selfrange);
            JsonDictionary.Add("items", list);
            JsonDictionary.Add("totalCount", total);
            JsonDictionary.Add("pageCount", pageTotal);
            return new JsonResult()
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        #endregion
    }
}
