using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProDAL
{
    public class WebSetDAL : BaseDAL
    {
        public static WebSetDAL BaseProvider = new WebSetDAL();

        public DataTable GetMemberLevel()
        {

            DataTable dt = GetDataTable("select * from MemberLevel where  Status=1 order by Origin");

            return dt;
        }
        public DataTable GetAdvertSetList(string imgType, string view)
        {
            string sqlwhere = "";
            if (!string.IsNullOrEmpty(imgType))
            {
                sqlwhere += " and imgType='" + imgType + "' ";
            }
            if (!string.IsNullOrEmpty(view))
            {
                sqlwhere += " and [view]='" + view + "' ";
            }
            DataTable dt = GetDataTable("select * from AdvertSet where 1=1 " + sqlwhere);

            return dt;
        }
        public DataTable GetMemberLevelByLevelID(string levelID)
        {
            string sqlText = "select * from MemberLevel where LevelID=@LevelID and Status=1";
            SqlParameter[] paras = { 
                                     new SqlParameter("@LevelID",levelID)
                                   };

            return GetDataTable(sqlText, paras, CommandType.Text);
        }
        public DataTable GetMemberLevelByOrigin(string origin)
        {
            string sqlText = "select * from MemberLevel where origin=@Origin  and Status=1 ";
            SqlParameter[] paras = { 
                                     new SqlParameter("@Origin",origin)
                                   };

            return GetDataTable(sqlText, paras, CommandType.Text);
        }
        public DataTable GetChargeSetDetail(string view)
        {
            SqlParameter[] paras = { 
                                    new SqlParameter("@View",view)
                                   };

            return GetDataTable("select * from ChargeSet where [View]=@View and Status=1", paras, CommandType.Text);
        }
        public DataTable GetActiveByID(string id)
        {
            SqlParameter[] paras = { 
                                    new SqlParameter("@AutoID",id)
                                   };

            return GetDataTable("select * from Active where AutoID=@AutoID and Status<>9", paras, CommandType.Text);
        }
        public DataTable GetPlays()
        { 
            return GetDataTable("select c.* from   Plays c where  c.Status<>9 order by c.AutoID");
        }
        public DataTable GetLotteryPlays(string CPcode)
        {
            string sqlwhere = " where a.Status<> 9 ";
            if (!string.IsNullOrEmpty(CPcode))
            {
                sqlwhere = " and a.CPCode='" + CPcode + "' ";
            }

            return GetDataTable("select c.*,b.PIDS,b.Content from Lottery a join LotteryPlays  b on a.CPCode=b.CPCode join Plays c on b.PID=c.PCode  " + sqlwhere + " order by b.AutoID");
        }
        #region 新增 
        public string InsertMemberLevel(string levelid, string name, decimal golds, string userid, decimal discountfee, decimal integfeemore, int origin, int status = 1, string imgurl = "", int type = 0)
        {
            SqlParameter[] paras = { 
                                     new SqlParameter("@result" , SqlDbType.VarChar,300),
                                     new SqlParameter("@LevelID" , levelid),
                                     new SqlParameter("@Name" , name), 
                                     new SqlParameter("@Golds" , golds),
                                     new SqlParameter("@DiscountFee" , discountfee),
                                     new SqlParameter("@IntegFeeMore" , integfeemore),
                                     new SqlParameter("@Status" , status),
                                      new SqlParameter("@Type" , type),
                                     new SqlParameter("@CreateUserID" , userid),
                                      new SqlParameter("@ImgUrl",imgurl), 
                                    
                                   };
            paras[0].Direction = ParameterDirection.Output;
            origin = ExecuteNonQuery("P_InsertMemberLevel", paras, CommandType.StoredProcedure);
            return Convert.ToString(paras[0].Value);
        }

        public bool InsertAdvert(string userid, string view, string content, string imgtype, string imgurl, string linkurl)
        {
            SqlParameter[] paras =
            { 
                new SqlParameter("@View", view),
                new SqlParameter("@Content", content),
                new SqlParameter("@ImgType", imgtype),
                new SqlParameter("@ImgUrl", imgurl),
                new SqlParameter("@UserID", userid),
                new SqlParameter("@LinkUrl", linkurl)
            };
            return ExecuteNonQuery("Insert into  AdvertSet([View],[Content],ImgType,ImgUrl,CreateTime,CreateUserID,LinkUrl) values (@View,@Content,@ImgType,@ImgUrl,getDate(),@UserID,@LinkUrl)", paras, CommandType.Text) > 0;
        }
        public bool InsertActive(string userid, string Title, string content, string Tips, string img, DateTime btime, DateTime etime,int type)
        {
            SqlParameter[] paras =
            { 
                new SqlParameter("@Title", Title),
                new SqlParameter("@Content", content),
                new SqlParameter("@Tips", Tips),
                new SqlParameter("@Img", img),
                new SqlParameter("@Type", type),
                new SqlParameter("@UserID", userid), 
                new SqlParameter("@ETime", etime),
                new SqlParameter("@BTime", btime)
            };
            return ExecuteNonQuery("Insert into  Active([Title],[Content],Tips,Img,CreateTime,CreateUserID,BTime,ETime,Type) values (@Title,@Content,@Tips,@Img,getDate(),@UserID,@BTime,@ETime,@Type)", paras, CommandType.Text) > 0;
        }
        public bool InsertChargeSet(string userid, string view, string remark, decimal golds)
        {
            SqlParameter[] paras =
            { 
                new SqlParameter("@View", view),
                new SqlParameter("@Remark", remark),
                new SqlParameter("@Golds", golds), 
                new SqlParameter("@UserID", userid)
            };
            return ExecuteNonQuery("Insert into  ChargeSet([View],[Remark],Golds,Status,CreateTime,UserID) values (@View,@Remark,@Golds,1,getDate(),@UserID)", paras, CommandType.Text) > 0;
        }

        public int InsertLottery(string cpname, string cpcode, int icontype, string resulturl, string userid, int openTimes, string closeTime, string onSaleTime, int sealTimes, int periodsNum, ref string errmsg)
        {
            SqlParameter[] paras =
            { 
                new SqlParameter("@Result",SqlDbType.Int),
                new SqlParameter("@ErrMsg",SqlDbType.NVarChar,300), 
                new SqlParameter("@CPName", cpname),
                new SqlParameter("@CPCode", cpcode),
                new SqlParameter("@IconType", icontype), 
                new SqlParameter("@ReturnUrl",resulturl),
                new SqlParameter("@OpenTimes",openTimes),
                new SqlParameter("@CloseTime",closeTime),
                new SqlParameter("@OnSaleTime",onSaleTime),
                new SqlParameter("@SealTimes",sealTimes),
                new SqlParameter("@PeriodsNum",periodsNum),
                new SqlParameter("@UserID", userid)
            };
            paras[0].Direction = ParameterDirection.Output;
            paras[1].Direction = ParameterDirection.Output;
            ExecuteNonQuery("P_InsertLottery", paras, CommandType.StoredProcedure);
            var result = Convert.ToInt32(paras[0].Value);
            errmsg = paras[1].Value.ToString();
            return result;
        }

        #endregion

        #region 修改  

        public bool UpdateActive(int autoid, string Title, string content, string Tips, string img, DateTime btime, DateTime etime, string upduserid)
        {
            SqlParameter[] paras =
            {
                new SqlParameter("@AutoID", autoid),
                new SqlParameter("@Title", Title),
                new SqlParameter("@Content", content),
                new SqlParameter("@Img", img),
                new SqlParameter("@Tips", Tips),
                new SqlParameter("@ETime", etime),
                new SqlParameter("@UpdUserID", upduserid),
                new SqlParameter("@BTime", btime)
            };
            return ExecuteNonQuery("Update Active set UpdUserID=@UpdUserID,[Content]=@Content,Img=@Img,Tips=@Tips,Title=@Title,UpdTime=getdate(),BTime=@BTime,ETime=@ETime   where AutoID=@AutoID ", paras, CommandType.Text) > 0;
        }
        public bool UpdateChargeSet(int autoid, string view, string remark, decimal golds)
        {
            SqlParameter[] paras =
            {
                new SqlParameter("@AutoID", autoid),
                new SqlParameter("@View", view),
                new SqlParameter("@Remark", remark),
                new SqlParameter("@Golds", golds)
            };
            return ExecuteNonQuery("Update ChargeSet set [View]=@View,[Remark]=@Remark,Golds=@Golds  where AutoID=@AutoID ", paras, CommandType.Text) > 0;
        }

        public bool UpdateLottery(string cpname, string cpcode, int icontype, string resulturl, int openTimes,string closeTime,string onSaleTime,int sealTimes,int periodsNum,int autoid)
        {
            SqlParameter[] paras =
            {  
                new SqlParameter("@AutoID",autoid), 
                new SqlParameter("@CPName", cpname),
                new SqlParameter("@CPCode", cpcode),
                new SqlParameter("@IconType", icontype), 
                new SqlParameter("@OpenTimes",openTimes),
                new SqlParameter("@CloseTime",closeTime),
                new SqlParameter("@OnSaleTime",onSaleTime),
                new SqlParameter("@SealTimes",sealTimes),
                new SqlParameter("@PeriodsNum",periodsNum),
                new SqlParameter("@ResultUrl",resulturl) 
            };
            return ExecuteNonQuery(@"Update Lottery set [CPName]=@CPName,[CPCode]=@CPCode,IconType=@IconType,ResultUrl=@ResultUrl,OpenTimes=@OpenTimes,CloseTime=@CloseTime,
OnSaleTime=@OnSaleTime,SealTimes=@SealTimes,PeriodsNum=@PeriodsNum where AutoID=@AutoID ", paras, CommandType.Text) > 0;
        }

        public bool DeleteActive(int autoid)
        {
            SqlParameter[] paras =
            {
                new SqlParameter("@AutoID", autoid)
            };
            return ExecuteNonQuery("update Active set Status=9 where AutoID=@AutoID ", paras, CommandType.Text) > 0;
        }
        public string UpdateMemberLevel(decimal golds, string levelid, string name, decimal discountfee, decimal integfeemore, string imgurl = "")
        {
            SqlParameter[] paras = { 
                                     new SqlParameter("@result" , SqlDbType.VarChar,300),
                                     new SqlParameter("@LevelID",levelid),
                                     new SqlParameter("@Name",name), 
                                     new SqlParameter("@DiscountFee" , discountfee),
                                     new SqlParameter("@IntegFeeMore" , integfeemore),
                                     new SqlParameter("@Golds" , golds),
                                     new SqlParameter("@ImgUrl",imgurl), 
                                   };
            paras[0].Direction = ParameterDirection.Output;
            ExecuteNonQuery("P_UpdateMemberLevel", paras, CommandType.StoredProcedure);
            return paras[0].Value.ToString(); ;
        }
        public string DeleteMemberLevel(string levelid)
        {
            SqlParameter[] paras = { 
                                     new SqlParameter("@result" , SqlDbType.VarChar,300),
                                     new SqlParameter("@LevelID",levelid) 
                                   };
            paras[0].Direction = ParameterDirection.Output;
            ExecuteNonQuery("P_DeleteMemberLevel", paras, CommandType.StoredProcedure);
            return paras[0].Value.ToString();
        }

        public bool UpdateAdvert(int autoid, string view, string content, string imgtype, string imgurl, string linkurl)
        {
            SqlParameter[] paras =
            {
                new SqlParameter("@AutoID", autoid),
                new SqlParameter("@View", view),
                new SqlParameter("@Content", content),
                new SqlParameter("@ImgType", imgtype),
                new SqlParameter("@LinkUrl", linkurl),
                new SqlParameter("@ImgUrl", imgurl)
            };
            return ExecuteNonQuery("Update AdvertSet set [View]=@View,[Content]=@Content,ImgType=@ImgType,ImgUrl=@ImgUrl,LinkUrl=@LinkUrl  where AutoID=@AutoID ", paras, CommandType.Text) > 0;
        }
        public bool DeleteAdvertSet(int autoid)
        {
            SqlParameter[] paras =
            {
                new SqlParameter("@AutoID", autoid)
            };
            return ExecuteNonQuery("Delete from AdvertSet where AutoID=@AutoID ", paras, CommandType.Text) > 0;
        } 
        #endregion
    }
}
