using ProDAL;
using ProEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using System.Web; 

namespace ProBusiness.Manage
{
    public class WebSetBusiness
    {
        public static string FILEPATH =ProTools.Common.GetKeyValue("UploadFilePath") + "Active/" + DateTime.Now.ToString("yyyyMM") + "/";
        public static string TempPath = ProTools.Common.GetKeyValue("UploadTempPath");

        private static List<MemberLevel> _memberLevelList;
        public static List<MemberLevel> MemberLevelList
        {
            get
            {
                if (_memberLevelList == null)
                {
                    _memberLevelList = new List<MemberLevel>();
                }
                return _memberLevelList;
            }
        }
        #region 查询   
        /// <summary>
        /// 
        /// </summary>
        /// <param name="type">0:会员等级 1 优惠活动</param>
        /// <returns></returns>
        public static List<MemberLevel> GetMemberLevel(int type = 0)
        {
            if (MemberLevelList.Count == 0)
            {
                List<MemberLevel> list = new List<MemberLevel>();
                DataTable dt = WebSetDAL.BaseProvider.GetMemberLevel();
                foreach (DataRow dr in dt.Rows)
                {
                    MemberLevel model = new MemberLevel();
                    model.FillData(dr);
                    list.Add(model);
                }
                MemberLevelList.AddRange(list);
            }
            if (type > -1)
            {
                return MemberLevelList.Where(x => x.Type == type).ToList();
            }
            else
            {
                return MemberLevelList.ToList();
            }
        }
        public static MemberLevel GetMemberLevelByID(string levelid)
        {
            if (string.IsNullOrEmpty(levelid))
            {
                return null;
            }
            var list = GetMemberLevel();
            if (list.Where(m => m.LevelID == levelid).Count() > 0)
            {
                return list.Where(m => m.LevelID == levelid).FirstOrDefault();
            }
            MemberLevel model = new MemberLevel();
            DataTable dt = WebSetDAL.BaseProvider.GetMemberLevelByLevelID(levelid);
            if (dt.Rows.Count > 0)
            {
                model.FillData(dt.Rows[0]);
                list.Add(model);
            }
            return model;
        }

        public static List<AdvertSet> GetAdvertSetList(string imgType = "", string view = "")
        {
            List<AdvertSet> list = new List<AdvertSet>();
            DataTable dt = WebSetDAL.BaseProvider.GetAdvertSetList(imgType, view);
            foreach (DataRow dr in dt.Rows)
            {
                AdvertSet model = new AdvertSet();
                model.FillData(dr);
                list.Add(model);
            }
            return list;
        }
        public static List<Active> GetActiveList(string keyWords, int pageIndex, int pageSize, ref int totalCount, ref int pageCount, string btime = "", string etime = "", int type=-1)
        { 
            string whereSql = " a.Status<>9";
            if (!string.IsNullOrEmpty(keyWords))
            {
                whereSql += " and (a.Title like '%" + keyWords + "%' or a.Tips like '%" + keyWords + "%' )";
            }
            if (!string.IsNullOrEmpty(btime))
            {
                whereSql += " and ( ( a.BTime<='" + etime + "' and a.BTime>='" + btime + "') or ( a.BTime>='" + btime + "' and a.ETime <='" + etime + "' ) or (a.Etime>='" + btime + "' and a.Etime<='" + etime + "'))";
            }
            if (type > -1)
            {
                whereSql += " and a.Type ="+ type +" ";
            }
            string cstr = @" a.*,b.UserName as CreateUser ";
            DataTable dt = CommonBusiness.GetPagerData(" Active a join M_Users b on a.CreateUserID=b.UserID ", cstr, whereSql, "a.AutoID", pageSize, pageIndex, out totalCount, out pageCount);
            
            List<Active> list = new List<Active>(); 
            foreach (DataRow dr in dt.Rows)
            {
                Active model = new Active();
                model.FillData(dr);
                list.Add(model);
            } 
            return list;
        }
        public static List<Active> GetActiveList(int type=0 ,int tops=9)
        {
            DataTable dt = WebSetDAL.GetDataTable("select top " + tops + " a.*  from  Active a  where a.Status<>9 and Type=" + type);

            List<Active> list = new List<Active>();
            foreach (DataRow dr in dt.Rows)
            {
                Active model = new Active();
                model.FillData(dr);
                list.Add(model);
            }
            return list;
        }
        public static Active GetActiveByID(string AutoID)
        {

            DataTable dt = WebSetDAL.BaseProvider.GetActiveByID(AutoID);
            Active model = null;
            if (dt.Rows.Count == 1)
            {
                model = new Active();
                model.FillData(dt.Rows[0]);
            }
            return model; 
        }
        public static List<ChargeSet> GetChargeSet(string keyWords, string userid,int status, int pageSize, int pageIndex, ref int totalCount, ref int pageCount, string begintime = "", string endtime = "")
        {
            string tablename = " ChargeSet  a left join M_Users b  on a.UserID =b.UserID ";
            string sqlwhere = " a.status<>9 ";
            if (!string.IsNullOrEmpty(keyWords))
            {
                sqlwhere += " and (b.Name like '%" + keyWords + "%' or a.Remark like '%" + keyWords + "%' or a.View like '%" + keyWords + "%')";
            } 
            if (status > -1)
            {
                sqlwhere += " and a.status=" + status;
            } 
            if (!string.IsNullOrEmpty(userid))
            {
                sqlwhere += " and a.UserID='" + userid + "' ";
            }
            if (!string.IsNullOrEmpty(begintime))
            {
                sqlwhere += " and a.CreateTime>='" + begintime + " 00:00:00'";
            }
            if (!string.IsNullOrEmpty(endtime))
            {
                sqlwhere += " and a.CreateTime<'" + endtime + " 23:59:59:999'";
            }
            DataTable dt = CommonBusiness.GetPagerData(tablename, "a.*,b.Name as UserName ", sqlwhere, "a.AutoID ", pageSize, pageIndex, out totalCount, out pageCount);
            List<ChargeSet> list = new List<ChargeSet>();
            foreach (DataRow dr in dt.Rows)
            {
                ChargeSet model = new ChargeSet();
                model.FillData(dr);
                list.Add(model);
            }
            return list;
        }

        public static ChargeSet GetChargeSetDetail(string view)
        {
            DataTable dt = WebSetDAL.BaseProvider.GetChargeSetDetail(view.Trim());
            ChargeSet model = null;
            if (dt.Rows.Count == 1)
            {
                model = new ChargeSet();
                model.FillData(dt.Rows[0]);
            }
            return model;
        }


        public static Lottery GetLotteryDetail(string cpCode)
        {
            var model=CommonBusiness.LottertList.Where(x => x.CPCode == cpCode).FirstOrDefault();
            if (model != null && !string.IsNullOrEmpty(model.CPName))
            {
                return model;
            }
            else
            {
                DataTable dt = new CommonDAL().GetLotteryList();
                List<Lottery> lottertList=new List<Lottery>();
                foreach (DataRow dr in dt.Rows)
                {
                    Lottery mod = new Lottery();
                    mod.FillData(dr);
                    lottertList.Add(mod);
                }
                CommonBusiness.LottertList = lottertList;
                return CommonBusiness.LottertList.Where(x => x.CPCode == cpCode).FirstOrDefault(); 
            }
        }
        public static Lottery GetLotteryDetailByID(int autoid)
        {
            var model = CommonBusiness.LottertList.Where(x => x.AutoID == autoid).FirstOrDefault();
            if (model != null && !string.IsNullOrEmpty(model.CPName))
            {
                return model;
            }
            else
            {
                DataTable dt = new CommonDAL().GetLotteryList();
                List<Lottery> lottertList = new List<Lottery>();
                foreach (DataRow dr in dt.Rows)
                {
                    Lottery mod = new Lottery();
                    mod.FillData(dr);
                    lottertList.Add(mod);
                }
                CommonBusiness.LottertList = lottertList;
                return CommonBusiness.LottertList.Where(x => x.AutoID == autoid).FirstOrDefault();
            }
        } 

        #endregion
        #region 新增 
        public static string CreateMemberLevel(string levelid, string name, decimal golds, string userid, decimal discountfee, decimal integfeemore, int status = 1, string imgurl = "", int origin = 1, int type = 0)
        {
            imgurl = GetUploadImgurl(imgurl);
            string result = WebSetDAL.BaseProvider.InsertMemberLevel(levelid, name.Trim(), golds, userid, discountfee, integfeemore, origin, status, imgurl, type);
            if (string.IsNullOrEmpty(result))
            {
                MemberLevelList.Add(new MemberLevel()
                {
                    Golds = golds,
                    LevelID = levelid,
                    DiscountFee = discountfee,
                    Name = name.Trim(),
                    ImgUrl = imgurl,
                    Origin = origin,
                    IntegFeeMore = integfeemore,
                    CreateUserID = userid,
                    CreateTime = DateTime.Now,
                    Type = type,
                    Status = 0
                });
            }
            return result;
        }

        public static bool InsertAdvert(AdvertSet model)
        {
            return WebSetDAL.BaseProvider.InsertAdvert(model.CreateUserID, model.View.ToLower(), model.Content, model.ImgType, model.ImgUrl, model.LinkUrl);
        }
        public static bool InsertActive(Active model)
        {
            model.Img = GetUploadImgurl(model.Img);
            return WebSetDAL.BaseProvider.InsertActive(model.CreateUserID,model.Title, model.Content, model.Tips, model.Img, model.BTime,model.ETime,model.Type);
        }

        public static bool InsertChargeSet(ChargeSet model)
        {
            return WebSetDAL.BaseProvider.InsertChargeSet(model.UserID, model.View.ToLower(), model.Remark, model.Golds);
        }

        public static int CreateLottery(string cpname, string cpcode, int icontype, string resulturl, string userid,int openTimes,string closeTime,string onSaleTime,int sealTimes,int periodsNum,ref string  errmsg)
        {
            var result= WebSetDAL.BaseProvider.InsertLottery(cpname, cpcode, icontype, resulturl, userid, openTimes,closeTime, onSaleTime, sealTimes, periodsNum ,ref errmsg);
            if (result > 0)
            {
                GetLotteryDetailByID(result);
            }
            return result;

        }

        #endregion

        #region 改 
        public static string UpdateMemberLevel(decimal golds, string levelid, string name, decimal discountfee, decimal integfeemore, string imgurl)
        {
            var model = GetMemberLevelByID(levelid);
            if (model == null)
            {
                return "信息已被删除,操作失败";
            }
            imgurl = GetUploadImgurl(imgurl);
            string result = WebSetDAL.BaseProvider.UpdateMemberLevel(golds, levelid, name.Trim(), discountfee, integfeemore, imgurl);
            if (string.IsNullOrEmpty(result))
            {
                var model2 = MemberLevelList.Where(x => x.LevelID == levelid).FirstOrDefault();
                model2.Name = name;
                model2.DiscountFee = discountfee;
                model2.Golds = golds;
                model2.IntegFeeMore = integfeemore;
                model2.ImgUrl = imgurl;
            }
            return result;
        }

        public static string DeleteMemberLevel(string levelid)
        {
            var model = GetMemberLevelByID(levelid);
            string bl = WebSetDAL.BaseProvider.DeleteMemberLevel(levelid);
            if (string.IsNullOrEmpty(bl))
            {
                MemberLevelList.Remove(model);
            }
            return bl;
        }

        public static bool UpdateAdvert(AdvertSet model)
        {
            return WebSetDAL.BaseProvider.UpdateAdvert(model.AutoID, model.View, model.Content, model.ImgType,
                model.ImgUrl, model.LinkUrl);
        }
        public static bool UpdateActive(Active model)
        {
            return WebSetDAL.BaseProvider.UpdateActive(model.AutoID, model.Title, model.Content, model.Tips, model.Img, model.BTime, model.ETime, model.UpdUserID);
        }
        public static bool UpdateChargeSet(ChargeSet model)
        {
            return WebSetDAL.BaseProvider.UpdateChargeSet(model.AutoID, model.View, model.Remark, model.Golds);
        }
        public static bool UpdateChargeSetStatus(int autoid,int status)
        {
            return CommonBusiness.Update("ChargeSet", "Status", status, " where Status<>9 and AutoID=" + autoid);
        }
        public static bool DeleteActive(int autoid)
        {
            return WebSetDAL.BaseProvider.DeleteActive(autoid);  
        } 
        public static bool UpdateUserLottery(int status, int autoid){
            bool bl = CommonBusiness.Update("Lottery","Status",status," AutoID="+autoid);
            if (bl)
            {
                var model = CommonBusiness.LottertList.Where(x => x.AutoID == autoid).FirstOrDefault();
                if (model != null && model.AutoID > 0)
                {
                    CommonBusiness.LottertList.Remove(model);
                    model.Status = status;
                    CommonBusiness.LottertList.Add(model);
                }
            }
            return bl;
        }

        public static bool UpdateLottery(string cpname, string cpcode, int icontype, string resulturl,int openTimes,string closeTime,string onSaleTime,int sealTimes,int periodsNum,int autoid)
        {
            bool bl = WebSetDAL.BaseProvider.UpdateLottery(cpname, cpcode, icontype, resulturl,openTimes,closeTime,onSaleTime,sealTimes,periodsNum, autoid);
            if (bl)
            {
                var model = CommonBusiness.LottertList.Where(x => x.AutoID == autoid).FirstOrDefault();
                if (model != null && model.AutoID>0)
                {
                    CommonBusiness.LottertList.Remove(model);
                    model.CPName = cpname;
                    model.CPCode = cpcode;
                    model.IconType = icontype;
                    model.ResultUrl = resulturl;
                    model.CloseTime = closeTime;
                    model.OnSaleTime = onSaleTime;
                    model.PeriodsNum = periodsNum;
                    model.SealTimes = sealTimes;
                    model.OpenTimes = openTimes;
                    CommonBusiness.LottertList.Add(model);
                }
            }
            return bl;
        }
        public static bool DeleteAdvertSet(int autoid)
        {
            return WebSetDAL.BaseProvider.DeleteAdvertSet(autoid);
        }
        #endregion
        public static string GetUploadImgurl(string imgurl)
        {
            if (!string.IsNullOrEmpty(imgurl) && imgurl.IndexOf(TempPath) >= 0)
            {
                DirectoryInfo directory = new DirectoryInfo(HttpContext.Current.Server.MapPath(FILEPATH));
                if (!directory.Exists)
                {
                    directory.Create();
                }
                if (imgurl.IndexOf("?") > 0)
                {
                    imgurl = imgurl.Substring(0, imgurl.IndexOf("?"));
                }
                FileInfo file = new FileInfo(HttpContext.Current.Server.MapPath(imgurl));
                imgurl = FILEPATH + file.Name;
                if (file.Exists)
                {
                    file.MoveTo(HttpContext.Current.Server.MapPath(imgurl));
                }
            }
            return imgurl;
        }
    }
}
