/**  版本信息模板在安装目录下，可自行修改。
* City.cs
*
* 功 能： N/A
* 类 名： City
*
* Ver    变更日期             负责人  变更内容
* ───────────────────────────────────
* V0.01  2015/3/6 19:52:51   N/A    初版
*
* Copyright (c) 2012 Maticsoft Corporation. All rights reserved.
*┌──────────────────────────────────┐
*│　此技术信息为本公司机密信息，未经本公司书面同意禁止向第三方披露．　│
*│　版权所有：动软卓越（北京）科技有限公司　　　　　　　　　　　　　　│
*└──────────────────────────────────┘
*/
using System;
using System.Data;
namespace ProEntity
{
	/// <summary>
	/// City:实体类(属性说明自动提取数据库字段的描述信息)
	/// </summary>
	[Serializable]
	public partial class Product
	{
        public Product()
		{}

        public int AutoID { get; set; }

        public string ProductCode { get; set; }

        public string TypeCode { get; set; }
	    public string TypeName { get; set; }
	    public int Sex { get; set; }
        public int Status { get; set; }
        public string Size { get; set; }
	    public DateTime CreateTime { get; set; }
	    public string ProductName { get; set; }
	    public decimal Price { get; set; }
	    public string Skus { get; set; }
        public decimal SalePrice { get; set; }
        public string Tips { get; set; }

        public string Img { get; set; }

        public string Imgs { get; set; }

        public string Remark { get; set; }

        public string Content { get; set; }
        public string  SJSContent { get; set; }
        /// <summary>
        /// 填充数据
        /// </summary>
        /// <param name="dr"></param>
        public void FillData(System.Data.DataRow dr)
        {
            dr.FillData(this);
        }
	}
}

