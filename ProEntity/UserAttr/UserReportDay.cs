using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProEntity
{
    [Serializable]
    public class UserReportDay
    {
         
        public int AutoID { get; set; }

        [Property("Lower")]
        public string UserID { get; set; }

        public string UserName { get; set; }

        public decimal UserPoint { get; set; }
 
        public decimal TotalPay { get; set; }
    
        public decimal TotalDraw { get; set; }
     
        public decimal TotalPayMent { get; set; }

        public decimal TotalWin { get; set; }

        public decimal TotalReturn { get; set; }

        public DateTime ReportTime { get; set; }

        public void FillData(System.Data.DataRow dr)
        {
            dr.FillData(this);
        }
    }
}
