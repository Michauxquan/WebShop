using ProBusiness.Manage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using ProBusiness;
using ProEntity;

namespace CPiao.Controllers
{
    [CPiao.Common.UserAuthorize]
    public class LotteryController : BaseController
    {
        //
        // GET: /Lottery/

        public ActionResult Index(string id)
        {
            ViewBag.CPCode = id;
            ViewBag.Model = WebSetBusiness.GetLotteryDetail(id);
            if (id == "TJSSC" || id == "XJSSC" || id == "HLJSSC")
            {
                return RedirectToAction("HighLottery", "Lottery", new {id = id});
            }
            else if (id == "SHSSL" || id == "FC3D")
            {
                return RedirectToAction("SSC3D", "Lottery", new { id = id });
            }
            else if (id == "CQSSC")
            {
                return RedirectToAction("CQLottery", "Lottery", new { id = id });
            }
            return View();
        }

        public ActionResult HighLottery(string id)
        {
            ViewBag.CPCode = id;
            ViewBag.Model = WebSetBusiness.GetLotteryDetail(id);
            return View();
        }
        public ActionResult SSC3D(string id)
        {
            ViewBag.CPCode = id;
            ViewBag.Model = WebSetBusiness.GetLotteryDetail(id);
            return View();
        }
        public ActionResult CQLottery(string id)
        {
            ViewBag.CPCode = id;
            ViewBag.Model = WebSetBusiness.GetLotteryDetail(id);
            return View();
        }
        public ActionResult LotteryRecord()
        {
            return View();
        }

        public ActionResult BettAutoRecord()
        {
            return View();
        }

        #region MyRegion 

        #endregion 

        public JsonResult GetUserLottery(string cpcode)
        {
            int total = 0;
            int pageTotal = 0;
            var items = LotteryOrderBusiness.GetLotteryOrder("", cpcode, CurrentUser.UserID, "","","", -1,-1, 20, 1, ref total,
                ref pageTotal, 0, DateTime.Now.ToString("yyyy-MM-dd") + " 00:00:00", DateTime.Now.ToString("yyyy-MM-dd"));
            JsonDictionary.Add("items", items); 
            return new JsonResult()
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public JsonResult GetLotteryRecord(string cpcode, int status, string lcode, string issuenum, string type, int selfrange,int winType, string btime, string etime, int pageIndex)
        {
            int total = 0;
            int pageTotal = 0;
            var items = LotteryOrderBusiness.GetLotteryOrder("", cpcode, CurrentUser.UserID, lcode, issuenum, type, status, winType, PageSize, pageIndex, ref total,
                ref pageTotal, selfrange, btime,etime);
            JsonDictionary.Add("items", items);
            JsonDictionary.Add("totalCount", total);
            JsonDictionary.Add("pageCount", pageTotal);
            return new JsonResult()
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public JsonResult GetlotteryResult(string cpcode,int status=2,int pagesize=4,bool orderby=false,string btime="",string etime="")
        {
            int total = 0;
            int pageTotal = 0;

            var items = LotteryResultBusiness.GetPagList(cpcode, status, orderby, pagesize, 1, ref total, ref pageTotal, btime,etime);
            //GetlotteryResult
            JsonDictionary.Add("item",
                LotteryResultBusiness.GetLotteryResult(cpcode, 0, cpcode == "FC3D" ? DateTime.Now.ToString("yyyy-MM-dd")+" 00:00:00" : DateTime.Now.AddMinutes(-40).ToString("yyyy-MM-dd HH:mm:ss"),
                    DateTime.Now.ToString("yyyy-MM-dd")));
            JsonDictionary.Add("items", items);
            return new JsonResult()
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public JsonResult GetLotteryWin(int pagesize = 5,decimal winFee=3000)
        {
            int total = 0;
            int pageTotal = 0;
            var items = LotteryResultBusiness.GetLotteryWin("", 2, winFee, pagesize, 1, ref total, ref pageTotal, DateTime.Now.AddDays(-2).ToString("yyyy-MM-dd") + " 00:00:00", DateTime.Now.AddDays(1).ToString("yyyy-MM-dd"));
            JsonDictionary.Add("items", items);
            return new JsonResult()
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public JsonResult GetBettAutoRecord(string cpcode, int status, string lcode, string issuenum, string type, int selfrange, int winType, string btime, string etime, int pageIndex)
        {
            int total = 0;
            int pageTotal = 0;
            var items = LotteryOrderBusiness.GetBettAutoRecord("", cpcode, CurrentUser.UserID, lcode, issuenum, type, status, winType, PageSize, pageIndex, ref total,
                ref pageTotal, selfrange, btime, etime);
            JsonDictionary.Add("items", items);
            JsonDictionary.Add("totalCount", total);
            JsonDictionary.Add("pageCount", pageTotal);
            return new JsonResult()
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public JsonResult AddLotteryOrders(string list, int usedisFee=0)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            List<LotteryOrder> models = serializer.Deserialize<List<LotteryOrder>>(list);
            string msg = "";
            var result = LotteryOrderBusiness.CreateUserOrderList(models, CurrentUser, OperateIP, usedisFee,3, ref msg);
            JsonDictionary.Add("result", result);
            JsonDictionary.Add("ErrMsg", msg);
            return new JsonResult()
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public JsonResult AddLotteryBett(string list, int isStart = 0)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            List<LotteryBettAuto> models = serializer.Deserialize<List<LotteryBettAuto>>(list);
            string msg = "";
            var result = LotteryOrderBusiness.CreateBettOrderList(models, CurrentUser, OperateIP, isStart, ref msg);
            JsonDictionary.Add("result", result);
            JsonDictionary.Add("ErrMsg", msg);
            return new JsonResult()
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
    }
}
    