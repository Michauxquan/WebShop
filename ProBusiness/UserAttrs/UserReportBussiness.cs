using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using ProEntity;

namespace ProBusiness.UserAttrs
{
    public class UserReportBussiness
    {
        public static List<UserReportDay> GetReportList(string btime, string etime,string userid, int pageIndex, int pageSize, ref int totalCount, ref int pageCount)
        {

            string whereSql = " b.Status<>9 ";

            if (!string.IsNullOrEmpty(btime))
            {
                whereSql += " and a.ReportTime>='" + btime + "'";
            }
            if (!string.IsNullOrEmpty(etime))
            {
                whereSql += " and a.ReportTime<'" + etime + "'";
            
            }
            if (!string.IsNullOrEmpty(userid))
            {
                whereSql += " and a.UserID='" + userid + "'";
            }
            string clumstr = "a.*,b.UserName";
            DataTable dt = CommonBusiness.GetPagerData("UserReportDay a join M_Users b on a.Userid=b.Userid ", clumstr, whereSql, "a.AutoID", pageSize, pageIndex, out totalCount, out pageCount);
            List<UserReportDay> list = new List<UserReportDay>();
            foreach (DataRow item in dt.Rows)
            {
                UserReportDay model = new UserReportDay();
                model.FillData(item);
                list.Add(model);
            }

            return list;
        }

        public static List<LotteryOrder> GetLotteryOrderReportList(string btime, string etime, int playtype,string cpcode, string userid, string lcode, string issuenum, string type, string state ,int winType, int pageIndex, int pageSize, ref int totalCount, ref int pageCount,int self = 0)
        {

            string whereSql = " a.AutoID>0 ";

            if (!string.IsNullOrEmpty(btime))
            {
                whereSql += " and a.CreateTime>='" + btime + "'";
            }
            if (!string.IsNullOrEmpty(etime))
            {
                whereSql += " and a.CreateTime<'" + etime + "'";
            }
            if (playtype > -1)
            {
                whereSql += " and a.playtype="+playtype;
            }
            if (!string.IsNullOrEmpty(type))
            {
                whereSql += " and b.Type like '%" + type + "%'";
            } 
            if (!string.IsNullOrEmpty(cpcode))
            {
                whereSql += " and b.cpcode='" + cpcode + "'";
            }
            if (winType > -1)
            {
                whereSql += " and b.WinType=" + winType;
            }
            if (!string.IsNullOrEmpty(userid))
            {
                if (self > 0)
                {
                    if (self == 1)
                    {
                        whereSql += " and b.UserID in(select UserID from UserRelation where ParentID='" + userid + "')";
                    }
                    else if (self == 2)
                    {
                        whereSql += " and b.UserID in(select UserID from UserRelation where Parents like '%" + userid + "%')";
                    }
                    else
                    {
                        whereSql += " and b.UserID='" + userid + "' ";
                    }
                }
            }
            if (!string.IsNullOrWhiteSpace(lcode))
            {
                if (!string.IsNullOrEmpty(state) )
                { 
                    whereSql += " and b." + state + " ='" + lcode + "'"; 
                } 
                else
                {
                    whereSql += " and (b.LCode like '%" + lcode + "%' or b.BCode like '%" + lcode + "%') ";
                }
            }
            if (!string.IsNullOrEmpty(issuenum))
            {
                whereSql += " and b.IssueNum ='" + issuenum + "'";
            }
            string clumstr = " b.LCode,b.IssueNum,b.Type,b.TypeName,b.CPCode,b.CPName, case when a.Type=0 then a.AccountChange else b.WinFee end WinFee,case when a.Type=1 then a.AccountChange else isnull(b.PayFee,0.00) end PayFee ,isnull(b.Remark,'') Remark, a.AutoID,a.Account ,a.PlayType,a.Remark PlayTypeName,c.UserName ,a.Type ChangeType ";
            DataTable dt = CommonBusiness.GetPagerData(" AccountOperateRecord a join M_Users c on a.UseriD=c.Userid left join LotteryOrder b on a.Userid=b.Userid and a.FkCode=b.LCode and b.Status<>9 ", clumstr, whereSql, "a.AutoID", pageSize, pageIndex, out totalCount, out pageCount);
            List<LotteryOrder> list = new List<LotteryOrder>();
            foreach (DataRow item in dt.Rows)
            {
                LotteryOrder model = new LotteryOrder();
                model.FillData(item);
                list.Add(model);
            }

            return list;
        }

    }
}
