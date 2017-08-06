using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ProDAL;
using ProDAL.UserAttrs;
using ProEntity;
using ProEntity.Manage;

namespace ProBusiness
{
   public class LotteryOrderBusiness
    {
       public static LotteryOrderBusiness BaseBusiness = new LotteryOrderBusiness();

        #region 查询

       public static List<LotteryOrder> GetLotteryOrder(string keyWords, string cpcode, string userid, string lcode, string issuenum, string type, int status, int winType,int pageSize, int pageIndex, ref int totalCount, ref int pageCount, int self = 0, string begintime = "", string endtime = "")
        {
            string tablename = "LotteryOrder  a left join M_Users b  on a.UserID =b.UserID left join lotteryResult c on a.IssueNum=c.IssueNum   and a.CPCode=c.CPCode ";
            string sqlwhere = " a.status<>9 ";
            if (!string.IsNullOrEmpty(keyWords))
            {
                sqlwhere += " and (b.UserName like '%" + keyWords + "%' or a.IssueNum like '%" + keyWords + "%' or a.LCode like '%" + keyWords + "%'  or a.TypeName like '%" + keyWords + "%')";
            }
            if (!string.IsNullOrEmpty(type))
            {
                sqlwhere += " and a.Type like '%" + type+"%'";
            }
            if (status > -1)
            {
                sqlwhere += " and a.status=" + status;
            }
            if (!string.IsNullOrEmpty(cpcode))
            {
                sqlwhere += " and a.cpcode='" + cpcode+"'";
            }
           if (winType > -1)
           {
               sqlwhere += " and a.WinType=" + winType;
           }
           if (!string.IsNullOrEmpty(userid))
            {
                if (self > 0)
                {
                    if (self == 1)
                    {
                        sqlwhere += " and a.UserID in(select UserID from UserRelation where ParentID='" + userid + "')";
                    }
                    else if (self == 2)
                    {
                        sqlwhere += " and a.UserID in(select UserID from UserRelation where Parents like '%" + userid + "%')";
                    }
                    else
                    {
                        sqlwhere += " and a.UserID='" + userid + "' ";
                    }
                }
            } 
           if (!string.IsNullOrEmpty(begintime))
            {
                sqlwhere += " and a.CreateTime>='" + begintime +"'";
            }
            if (!string.IsNullOrEmpty(endtime))
            {
                sqlwhere += " and a.CreateTime<'" + endtime + " 23:59:59:999'";
            }
           if (!string.IsNullOrWhiteSpace(lcode))
           {
               sqlwhere += " and a.LCode ='" + lcode + "'";
           }
           if (!string.IsNullOrEmpty(issuenum))
           {
               sqlwhere += " and a.IssueNum ='" + issuenum + "'";
           }
           DataTable dt = CommonBusiness.GetPagerData(tablename, "a.*,b.UserName,c.ResultNum ", sqlwhere, "a.AutoID ", pageSize, pageIndex, out totalCount, out pageCount);
            List<LotteryOrder> list = new List<LotteryOrder>();
            foreach (DataRow dr in dt.Rows)
            {
                LotteryOrder model = new LotteryOrder();
                model.FillData(dr);
                list.Add(model);
            }
            return list;
        }
       public static LotteryOrder GetUserOrderDetail(string lcode)
       {
           DataTable dt = LotteryOrderDAL.BaseProvider.GetLotteryOrderDetail(lcode);
           LotteryOrder model = null;
           if (dt.Rows.Count == 1)
           {
               model = new LotteryOrder();
               model.FillData(dt.Rows[0]);
           }
           return model;
       }

       public static List<LotteryBettAuto> GetBettAutoRecord(string keyWords, string cpcode, string userid, string bCode, string issuenum, string type, int status, int winType, int pageSize, int pageIndex, ref int totalCount, ref int pageCount, int self = 0, string begintime = "", string endtime = "")
        {
            string tablename = "LotteryBettAuto  a left join M_Users b  on a.UserID =b.UserID   ";
            string sqlwhere = " a.status<>9 ";
            if (!string.IsNullOrEmpty(keyWords))
            {
                sqlwhere += " and (b.UserName like '%" + keyWords + "%' or a.StartNum like '%" + keyWords + "%' or a.BCode like '%" + keyWords + "%'  or a.TypeName like '%" + keyWords + "%')";
            }
            if (!string.IsNullOrEmpty(type))
            {
                sqlwhere += " and a.Type like '%" + type+"%'";
            }
            if (status > -1)
            {
                sqlwhere += " and a.status=" + status;
            }
           if (winType > -1)
           {
               sqlwhere += " and a.WinType=" + winType;
           }
           if (!string.IsNullOrEmpty(userid))
            {
                if (self > 0)
                {
                    if (self == 1)
                    {
                        sqlwhere += " and a.UserID in(select UserID from UserRelation where ParentID='" + userid + "')";
                    }
                    else if (self == 2)
                    {
                        sqlwhere += " and a.UserID in(select UserID from UserRelation where Parents like '%" + userid + "%')";
                    }
                    else
                    {
                        sqlwhere += " and a.UserID='" + userid + "' ";
                    }
                }
            } 
           if (!string.IsNullOrEmpty(begintime))
            {
                sqlwhere += " and a.CreateTime>='" + begintime +"'";
            }
            if (!string.IsNullOrEmpty(endtime))
            {
                sqlwhere += " and a.CreateTime<'" + endtime + " 23:59:59:999'";
            }
            if (!string.IsNullOrWhiteSpace(bCode))
           {
               sqlwhere += " and a.BCode ='" + bCode + "'";
           }
           if (!string.IsNullOrEmpty(issuenum))
           {
               sqlwhere += " and a.StartNum ='" + issuenum + "'";
           }
           DataTable dt = CommonBusiness.GetPagerData(tablename, "a.*,b.UserName ", sqlwhere, "a.AutoID ", pageSize, pageIndex, out totalCount, out pageCount);
           List<LotteryBettAuto> list = new List<LotteryBettAuto>();
            foreach (DataRow dr in dt.Rows)
            {
                LotteryBettAuto model = new LotteryBettAuto();
                model.FillData(dr);
                list.Add(model);
            }
            return list;
        }
       public static List<LotteryBettAuto> GetBettAutoByStatus()
       { 
           DataTable dt =LotteryOrderDAL.GetDataTable(
                   "select  a.*,b.UserName from LotteryBettAuto  a left join M_Users b  on a.UserID =b.UserID where a.Status=0 and b.Status<>9");
           List<LotteryBettAuto> list = new List<LotteryBettAuto>();
           foreach (DataRow dr in dt.Rows)
           {
               LotteryBettAuto model = new LotteryBettAuto();
               model.FillData(dr);
               list.Add(model);
           }
           return list;
       }

       public static UserReportDay GetUserWinDay(string userid)
       {
           DataTable dt = LotteryOrderDAL.GetDataTable("select sum(PayFee) as TotalPayMent,sum(WinFee) TotalWin from LotteryOrder where UserID='" + userid + "' and CreateTime>=convert(varchar(10),getdate(),120)");
           UserReportDay model = new UserReportDay();
           foreach (DataRow dr in dt.Rows)
           {
               model.FillData(dr);
           }
           return model;
       }

       #endregion

        #region 添加.删除



       public static int CreateUserOrderList(List<LotteryOrder> models, M_Users user,string ip,int usedisFee,int palytype,ref string errmsg )
       {
           int k = 0;
           string msg = "";
           models.ForEach(x =>
           {
               string errormsg = "";
               string orderCode = DateTime.Now.ToString("yyyyMMddhhMMssfff") + user.AutoID;
               var result = CreateLotteryOrder(orderCode, x.IssueNum, x.Type,x.TypeName,x.CPCode, x.CPName, x.Content.Replace("\"",""),
                   x.Num, x.PayFee, user.UserID, x.PMuch, x.RPoint, ip, usedisFee,palytype, "",ref errormsg);
               if (!result)
               {
                   msg += x.Content + "    " + errormsg+"/n";
               }
               else
               {
                   k++;
               }
           });
           errmsg = msg;
           return k;
       }

       public static bool CreateLotteryOrder(string ordercode, string issueNum, string type, string typename,string cpcode, string cpname, string content,  int num,
           decimal payfee, string userID, int pmuch, decimal rpoint, string operatip,int usedisFee,int palytype, string bCode,ref string errormsg)
       {
           var orderid = Guid.NewGuid().ToString();
           return LotteryOrderDAL.BaseProvider.CreateLotteryOrder(ordercode, orderid,issueNum, type, cpcode, cpname, content, typename, num,
            payfee, userID, pmuch, rpoint, operatip, usedisFee, palytype, bCode,ref errormsg);
       }
        public static bool DeleteOrder(string ordercode)
        {
            bool bl = CommonBusiness.Update("LotteryOrder", "Status", 9, "LCode='" + ordercode + "'");
            return bl;
        }
        public static bool BoutOrder(string ordercode)
        {
            bool bl = CommonBusiness.Update("LotteryOrder", "Status", 3, "LCode='" + ordercode + "' and Status=0");
            return bl;
        }


        public static int CreateBettOrderList(List<LotteryBettAuto> models, M_Users user, string ip, int isStart, ref string errmsg)
        {
            int k = 0;
            string msg = "";
            models.ForEach(x =>
            {
                string errormsg = "";
                string orderCode = DateTime.Now.ToString("yyyyMMddhhMMssfff") + user.AutoID;
                var result = CreateBettOrder(orderCode, x.StartNum, x.Type, x.TypeName, x.CPCode, x.CPName, x.Content.Replace("\"", ""),
                    x.Num, x.PayFee, user.UserID, x.PMuch, x.RPoint, ip, isStart,x.BettNum,x.BMuch,x.TotalFee,x.Profits,x.WinFee, x.BettType,x.JsonContent,ref errormsg);
                if (!result)
                {
                    msg += x.Content + "    " + errormsg + "/n";
                }
                else
                {
                    k++;
                }
            });
            errmsg = msg;
            return k;
        }
        public static bool CreateBettOrder(string ordercode, string issueNum, string type, string typename, string cpcode, string cpname, string content, int num, decimal payfee, string userID,
           int pmuch, decimal rpoint, string operatip, int isStart, int bettnum, int bmuch, decimal totalfee, decimal profits, decimal winfee, int bettType,string jsonContent, ref string errormsg)
        { 
            return LotteryOrderDAL.BaseProvider.CreateBettOrder(ordercode,  issueNum, type, typename, cpcode, cpname, content, num,
             payfee, userID, pmuch, rpoint, operatip, isStart, bettnum, bmuch, totalfee, profits, winfee,bettType,jsonContent, ref errormsg);
        }
       #endregion 

        #region 修改

       public static bool UpdateBettAutoByCode(string bCode, int comnum,decimal comfee, string remark)
       {
           return LotteryOrderDAL.BaseProvider.UpdateBettAutoByCode(bCode, comnum,comfee, remark);
       }

       #endregion
        
    }
}
