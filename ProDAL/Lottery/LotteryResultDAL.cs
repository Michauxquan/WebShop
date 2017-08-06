using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProDAL
{
    public class LotteryResultDAL:BaseDAL
    {
        public static LotteryResultDAL BaseProvider = new LotteryResultDAL();



        public void InsertLotteryResultAll()
        {
            SqlParameter[] paras = {};
            ExecuteNonQuery("InsertLotteryResultAll", paras, CommandType.StoredProcedure);
        }

        public bool UpdateLotteryResult(string issuenum, string cpcode, int status)
        {
            SqlParameter[] paras = {new SqlParameter("@IssueNum",issuenum),
                                       new SqlParameter("@Status",status),
                                       new SqlParameter("@CPCode",cpcode)
                                   };
            return ExecuteNonQuery("Update LotteryResult set Status=@Status  where IssueNum=@IssueNum and CPCode=@CPCode", paras, CommandType.Text) > 0;
        }
        public bool UpdateLotteryStatus(string cpcode, int status)
        {
            SqlParameter[] paras = {
                                       new SqlParameter("@Status",status),
                                       new SqlParameter("@CPCode",cpcode)
                                   };
            return ExecuteNonQuery("UpdateLotteryStatus", paras, CommandType.StoredProcedure) > 0;
        }
        public bool OpenResult(string resultnum, string issuenum, string cpcode)
        {
            SqlParameter[] paras = {
                                       new SqlParameter("@ResultNum",resultnum),
                                        new SqlParameter("@IssueNum",issuenum),
                                       new SqlParameter("@CPCode",cpcode)
                                   };
            return ExecuteNonQuery("M_OpenResult", paras, CommandType.StoredProcedure) > 0;
        } 

        /// <summary>
        /// 
        /// </summary>
        /// <param name="cpcode">以,结尾</param>
        /// <param name="openTime"></param>
        /// <returns></returns>
        public bool UpdateByStatusAndOpentTime(string cpcode, string openTime)
        {
            cpcode = cpcode.TrimEnd(',');
            cpcode ="'"+ cpcode.Replace(",", "','")+"'";
            SqlParameter[] paras = { 
                                       new SqlParameter("@OpenTime",openTime),
                                       new SqlParameter("@CPCode",cpcode)
                                   };
            return ExecuteNonQuery("Update LotteryResult set Status=1  where Opentime<@OpenTime and CPCode in (@CPCode) and Status=0", paras, CommandType.Text) > 0;
        }
    }
}
