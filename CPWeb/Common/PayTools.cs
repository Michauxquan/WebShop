using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Xml;
using System.Xml.Linq;
using System.Xml.XPath;
using Org.BouncyCastle;
using Org.BouncyCastle.Crypto.Parameters;
using Org.BouncyCastle.Security;
using ThoughtWorks.QRCode.Codec;

namespace CPiao.Common
{
    public class PayTools
    {
        public static string partner = ProTools.AppConfig.BUAppKey;
        public static string  key= ProTools.AppConfig.BUAppSecretKey;
        public static string apiurl = ProTools.AppConfig.BUAppUrl;

        /*
         * 
         * 银行编码	银行名称
                ICBC	工商银行
                ABC	农业银行
                CCB	建设银行
                BOC	中国银行
                CMB	招商银行
                BCCB	北京银行
                BOCO	交通银行
                CIB	兴业银行
                NJCB	南京银行
                CMBC	民生银行
                CEB	光大银行
                PINGANBANK	平安银行
                CBHB	渤海银行
                HKBEA	东亚银行
                NBCB	宁波银行
                CTTIC	中信银行
                GDB	广发银行
                SHB	上海银行
                SPDB	上海浦东发展银行
                PSBS	中国邮政
                HXB	华夏银行
                BJRCB	北京农村商业银行
                SRCB	上海农商银行
                SDB	深圳发展银行
                CZB	浙江稠州商业银行
                ALIPAY	支付宝
                ALIPAYSCAN	支付宝扫码
                TENPAY	财付通
                WEIXIN	微信
                QQ	QQ钱包
                ALIPAYWAP	WAP支付宝
                TENPAYWAP	WAP财付通
                WEIXINWAP	WAP微信
                QQWAP	WAPQQ钱包
                WEIXINJSAPI	微信公众号支付
         */
        /// <summary>
        /// 
        /// </summary>
        /// <param name="ordernumber">订单号</param>
        /// <param name="banktype">支付类型 参考1</param>
        /// <param name="paymoney">付款金额</param>
        /// <param name="hrefbackurl">同步通知接口 在支付完成后布优接口将会跳转到的商户系统连接地址</param>
        /// <param name="isshow">是否显示收银台 该参数为支付宝扫码、微信、QQ钱包专用，默认为1，跳转到网关页面进行扫码，如设为0，则网关只返回二维码图片地址供用户自行调用</param>
        /// <param name="attach">备注 备注信息，下行中会原样返回。若该值包含中文，请注意编码</param>
        /// <param name="callbackurl"></param>
        /// <returns></returns>
        public static string onLinePay(string ordernumber, string banktype, string paymoney, string hrefbackurl="",string isshow="1",string attach="", string callbackurl="")
        { 
            string signSource = string.Format("partner={0}&banktype={1}&paymoney={2}&ordernumber={3}&callbackurl={4}{5}", partner, banktype, paymoney, ordernumber, callbackurl, key);
            string sign = MD5(signSource, false).ToLower();
            string postUrl = apiurl + "?partner=" + partner;
            StringBuilder postData = new StringBuilder(postUrl);
            postData.Append("&banktype=" + banktype);
            postData.Append("&paymoney=" + paymoney);
            postData.Append("&ordernumber=" + ordernumber);
            postData.Append("&callbackurl=" + callbackurl);
            //if (!string.IsNullOrEmpty(hrefbackurl))
            //{
                postData.Append("&hrefbackurl=" + hrefbackurl);
            //}
            //if (!string.IsNullOrEmpty(attach))
            //{
                postData.Append("&attach=" + attach);
            //}
            postData.Append("&isshow=" + isshow);
            postData.Append("&sign=" + sign);
            return postData.ToString();
        }
        /// <summary>
        /// MD5函数
        /// </summary>
        /// <param name="str">原始字符串</param>
        /// <param name="half">为真则为16位,否则32位</param>
        /// <returns>MD5结果</returns>
        public static string MD5(string str, bool half)
        {
            byte[] b = Encoding.UTF8.GetBytes(str);
            b = new MD5CryptoServiceProvider().ComputeHash(b);
            string ret = "";
            for (int i = 0; i < b.Length; i++)
            {
                ret += b[i].ToString("x").PadLeft(2, '0');
            }
            if (half)
            {
                ret = ret.Substring(8, 16);
            }
            return ret;
        }
    }

    public class ZHFPayTools
    {
        public static string partner = ProTools.AppConfig.ZHFAppKey ;
        public static string key = ProTools.AppConfig.ZHFAppSecretKey;
        public static string apiurl = ProTools.AppConfig.ZHFAppUrl;
        public static string zhfpubkey = ProTools.AppConfig.ZHFPublicKey;
        public static Dictionary<string,string> onLinePay(string ip, string returnparam, string hrefbackurl, decimal payfee, string orderno,string ordertime
            , string paytype, string pdtname, int num,string username,string returnurl)
        {
            string signSrc = "";
            Dictionary<string,string> dc=new Dictionary<string, string>();
            dc.Add("client_ip", ip);
            //组织订单信息 
            if (ip != "")
            {
                signSrc = signSrc + "client_ip=" + ip + "&";
            }
            dc.Add("extend_param", "");
            if (!string.IsNullOrEmpty(username))
            {
                dc["extend_param"] = "customer_name^" + returnparam + "|ship_to_name^" + returnparam;
                signSrc = signSrc + "extend_param=customer_name^" + returnparam + "|ship_to_name^" + returnparam + "&";
            }
            dc.Add("extra_return_param", returnparam); 
            if (returnparam != "")
            { 
                signSrc = signSrc + "extra_return_param=" + returnparam + "&";
            }
            dc.Add("input_charset", "UTF-8");
            var version = "V3.0";
            if (paytype.IndexOf("scan") > -1)
            {
                version = "V3.1";
            }  
            dc.Add("interface_version", version);
            dc.Add("merchant_code", partner);
            signSrc = signSrc + "input_charset=UTF-8&interface_version=" + version + "&";  
            signSrc = signSrc + "merchant_code=" + partner + "&";
            dc.Add("notify_url", hrefbackurl); 
            if (hrefbackurl != "")
            {
                signSrc = signSrc + "notify_url=" + hrefbackurl + "&";
            }
            dc.Add("order_amount", payfee.ToString("#0.00")); 
            if (payfee >0)
            {
                signSrc = signSrc + "order_amount=" + payfee.ToString("#0.00") + "&";
            }
            dc.Add("order_no", orderno); 
            if (orderno != "")
            {
                signSrc = signSrc + "order_no=" + orderno + "&";
            }
            dc.Add("order_time", ordertime); 
            if (ordertime != "")
            {
                signSrc = signSrc + "order_time=" + ordertime + "&";
            }
            dc.Add("pay_type", paytype); 
            if (paytype != "")
            {
                signSrc = signSrc + "pay_type=" + paytype + "&";
            }
            dc.Add("product_name", pdtname); 
            if (pdtname != "")
            {
                signSrc = signSrc + "product_name=" + pdtname + "&";
            }
            dc.Add("product_num", num.ToString()); 
            if (num >0)
            {
                signSrc = signSrc + "product_num=" + num + "&";
            }
            dc.Add("redo_flag", "1"); 
            signSrc = signSrc + "redo_flag=1&";
            dc.Add("return_url", returnurl); 
            if (returnurl != "")
            {
                signSrc = signSrc + "return_url=" + returnurl + "&";
            }
            dc.Add("service_type", "direct_pay"); 
           signSrc=signSrc+"service_type=direct_pay";  

            
            /**  merchant_private_key，商户私钥，商户按照《密钥对获取工具说明》操作并获取商户私钥。获取商户私钥的同时，也要
                获取商户公钥（merchant_public_key）并且将商户公钥上传到智汇付商家后台"公钥管理"（如何获取和上传请看《密钥对获取工具说明》），
                不上传商户公钥会导致调试的时候报错“签名错误”。
            */ 

            string merchant_private_key = key;
            //私钥转换成C#专用私钥
            merchant_private_key = RSAPrivateKeyJava2DotNet(merchant_private_key);
            //签名
            string signData = RSASign(signSrc, merchant_private_key);
            signSrc = signSrc +"&sign="+signData+"&sign_type=RSA-S";
            dc.Add("sign", signData);
            dc.Add("sign_type", "RSA-S");
            return dc;
            //return httppost(apiurl, signSrc, "UTF-8");
        }

        public static Dictionary<string, string> onLinePay2(string ip, string returnparam, string hrefbackurl, decimal payfee, string orderno, string ordertime
    , string paytype, string pdtname, int num, string username, string returnurl)
        {
            string signSrc = "";
            Dictionary<string, string> dc = new Dictionary<string, string>();
            dc.Add("client_ip", ip);
            //组织订单信息 
            if (ip != "")
            {
                signSrc = signSrc + "client_ip=" + ip + "&";
            }
            dc.Add("extend_param", "");
            if (!string.IsNullOrEmpty(username))
            {
                dc["extend_param"] = "customer_name^" + returnparam + "|ship_to_name^" + returnparam;
                signSrc = signSrc + "extend_param=customer_name^" + returnparam + "|ship_to_name^" + returnparam + "&";
            }
            dc.Add("extra_return_param", returnparam);
            if (returnparam != "")
            {
                signSrc = signSrc + "extra_return_param=" + returnparam + "&";
            } 
            dc.Add("interface_version", "V3.1");
            dc.Add("merchant_code", partner);
            signSrc = signSrc + "interface_version=V3.1&";
            signSrc = signSrc + "merchant_code=" + partner + "&";
            dc.Add("notify_url", hrefbackurl);
            if (hrefbackurl != "")
            {
                signSrc = signSrc + "notify_url=" + hrefbackurl + "&";
            }
            dc.Add("order_amount", payfee.ToString("#0.00"));
            if (payfee > 0)
            {
                signSrc = signSrc + "order_amount=" + payfee.ToString("#0.00") + "&";
            }
            dc.Add("order_no", orderno);
            if (orderno != "")
            {
                signSrc = signSrc + "order_no=" + orderno + "&";
            }
            dc.Add("order_time", ordertime);
            if (ordertime != "")
            {
                signSrc = signSrc + "order_time=" + ordertime + "&";
            } 
            dc.Add("product_name", pdtname);
            if (pdtname != "")
            {
                signSrc = signSrc + "product_name=" + pdtname + "&";
            }
            dc.Add("product_num", num.ToString());
            if (num > 0)
            {
                signSrc = signSrc + "product_num=" + num + "&";
            } 
            dc.Add("service_type", paytype);
            signSrc = signSrc + "service_type=" + paytype;


            /**  merchant_private_key，商户私钥，商户按照《密钥对获取工具说明》操作并获取商户私钥。获取商户私钥的同时，也要
                获取商户公钥（merchant_public_key）并且将商户公钥上传到智汇付商家后台"公钥管理"（如何获取和上传请看《密钥对获取工具说明》），
                不上传商户公钥会导致调试的时候报错“签名错误”。
            */

            string merchant_private_key = key;
            //私钥转换成C#专用私钥
            merchant_private_key = RSAPrivateKeyJava2DotNet(merchant_private_key);
            //签名
            string signData = RSASign(signSrc, merchant_private_key);
            signData = HttpUtility.UrlEncode(signData);
            signSrc = signSrc +  "&sign_type=RSA-S&sign=" + signData;
            dc.Add("sign", signData);
            dc.Add("sign_type", "RSA-S");
            string _xml = HttpPostContent("https://api.zhihpay.com/gateway/api/scanpay", signSrc);

            //get data from XML
            var el = XElement.Load(new StringReader(_xml));
            LogHelper.Info("UpdateStatus", "TaskBase", "_xml" + _xml);
            //get Qrcode
            var qrcode1 = el.XPathSelectElement("/response/qrcode");
            if (qrcode1 == null)
            {
                dc.Add("msg", _xml);
                dc.Add("img", "");
                dc.Add("qrcodeurl", ""); 
            }
            else
            {

                dc.Add("msg", "");
                dc.Add("img", "");
                string qrcode = "";
                XmlDocument xmldoc = new XmlDocument();
                xmldoc.Load(new StringReader(_xml));  //读取xml文件 filepath为xml文件路径，自行获取
                XmlNode xNode = null;
                xNode = xmldoc.SelectSingleNode("dinpay/response/isRedirect");
                string isRedirect = "n";
                if (xNode != null)
                {
                    isRedirect = xNode.InnerText;
                }
                if (isRedirect == "n")
                {
                    qrcode = Regex.Match(qrcode1.ToString(), "(?<=>).*?(?=<)").Value; //qrcode
                    qrcode = HttpUtility.HtmlDecode(qrcode);
                    Bitmap bmp = QRCodeHelper.GetQRCodeBmp(qrcode);
                    dc["img"] = ImgToBase64String(bmp);
                }
                else
                {
                    xNode = xmldoc.SelectSingleNode("dinpay/response/qrcode");

                    if (xNode != null && xNode.InnerText != "")
                    {
                        LogHelper.Info("UpdateStatus", "TaskBase", "xNode.InnerText:" + xNode.InnerText);
                        qrcode = xNode.InnerText.ToString();
                        //qrcode = qrcode.Replace("&amp;", "&");
                    }

                    LogHelper.Info("UpdateStatus", "TaskBase", "qrcode:" + qrcode);
                    dc.Add("qrcodeurl", qrcode); 
                }

            }
            return dc;
            //return httppost(apiurl, signSrc, "UTF-8");
        } 
        //商户私钥签名
        public static string RSASign(string signStr, string privateKey)
        {
            try
            {
                RSACryptoServiceProvider rsa = new RSACryptoServiceProvider();
                RSAParameters para = new RSAParameters();
                rsa.FromXmlString(privateKey);
                byte[] signBytes = rsa.SignData(UTF8Encoding.UTF8.GetBytes(signStr), "md5");
                return Convert.ToBase64String(signBytes);
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        //RSA私钥格式转换
        public static string RSAPrivateKeyJava2DotNet(string privateKey)
        {
            RsaPrivateCrtKeyParameters privateKeyParam = (RsaPrivateCrtKeyParameters)PrivateKeyFactory.CreateKey(Convert.FromBase64String(privateKey));
            return string.Format(
                "<RSAKeyValue><Modulus>{0}</Modulus><Exponent>{1}</Exponent><P>{2}</P><Q>{3}</Q><DP>{4}</DP><DQ>{5}</DQ><InverseQ>{6}</InverseQ><D>{7}</D></RSAKeyValue>",
                Convert.ToBase64String(privateKeyParam.Modulus.ToByteArrayUnsigned()),
                Convert.ToBase64String(privateKeyParam.PublicExponent.ToByteArrayUnsigned()),
                Convert.ToBase64String(privateKeyParam.P.ToByteArrayUnsigned()),
                Convert.ToBase64String(privateKeyParam.Q.ToByteArrayUnsigned()),
                Convert.ToBase64String(privateKeyParam.DP.ToByteArrayUnsigned()),
                Convert.ToBase64String(privateKeyParam.DQ.ToByteArrayUnsigned()),
                Convert.ToBase64String(privateKeyParam.QInv.ToByteArrayUnsigned()),
                Convert.ToBase64String(privateKeyParam.Exponent.ToByteArrayUnsigned())
            );
        }

        //使用智汇付公钥验签
        public static bool ValidateRsaSign(string plainText, string publicKey, string signedData)
        {
            try
            {
                RSACryptoServiceProvider rsa = new RSACryptoServiceProvider();
                RSAParameters para = new RSAParameters();
                rsa.FromXmlString(publicKey);
                return rsa.VerifyData(UTF8Encoding.UTF8.GetBytes(plainText), "md5", Convert.FromBase64String(signedData));
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        //智汇付公钥格式转换
        public static string RSAPublicKeyJava2DotNet(string publicKey)
        {
            RsaKeyParameters publicKeyParam = (RsaKeyParameters)PublicKeyFactory.CreateKey(Convert.FromBase64String(publicKey));
            return string.Format(
                "<RSAKeyValue><Modulus>{0}</Modulus><Exponent>{1}</Exponent></RSAKeyValue>",
                Convert.ToBase64String(publicKeyParam.Modulus.ToByteArrayUnsigned()),
                Convert.ToBase64String(publicKeyParam.Exponent.ToByteArrayUnsigned())
            );
        }
        /// <summary>
        /// 图片转bitmap
        /// </summary>
        /// <param name="Imagefilename"></param>
        /// <returns></returns>
        protected static string ImgToBase64String(Bitmap bmp)
        {
            try
            { 
                MemoryStream ms = new MemoryStream();
                bmp.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);
                byte[] arr = new byte[ms.Length];
                ms.Position = 0;
                ms.Read(arr, 0, (int)ms.Length);
                ms.Close();
                return Convert.ToBase64String(arr);
            }
            catch (Exception ex)
            {
                return null;
            }
        }  
        /// <summary>
        /// 图片转bitmap
        /// </summary>
        /// <param name="Imagefilename">图片路径</param>
        /// <returns></returns>
        protected static string ImgToBase64String(string Imagefilename)
        {
            try
            {
                Bitmap bmp = new Bitmap(Imagefilename);
                MemoryStream ms = new MemoryStream();
                bmp.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);
                byte[] arr = new byte[ms.Length];
                ms.Position = 0;
                ms.Read(arr, 0, (int)ms.Length);
                ms.Close();
                return Convert.ToBase64String(arr);
            }
            catch (Exception ex)
            {
                return null;
            }
        }  
        /// <summary>
        /// 二维码生成
        /// </summary>
        public class QRCodeHelper
        {
            #region 根据链接获取二维码
            /// <summary>
            /// 根据链接获取二维码
            /// </summary>
            /// <param name="link">链接</param>
            /// <returns>返回二维码图片</returns>
            public static Bitmap GetQRCodeBmp(string link)
            {
                QRCodeEncoder qrCodeEncoder = new QRCodeEncoder();
                qrCodeEncoder.QRCodeEncodeMode = QRCodeEncoder.ENCODE_MODE.BYTE;
                qrCodeEncoder.QRCodeScale = 4;
                qrCodeEncoder.QRCodeVersion = 0;
                qrCodeEncoder.QRCodeErrorCorrect = QRCodeEncoder.ERROR_CORRECTION.M;
                Bitmap bmp = qrCodeEncoder.Encode(link);

                return bmp;
            }
            #endregion

        }
        /// <summary>
        /// post请求到指定地址并获取返回的信息内容
        /// </summary>
        /// <param name="url">请求地址</param>
        /// <param name="postData">请求参数</param>
        /// <param name="encodeType">编码类型如：UTF-8</param>
        /// <returns>返回响应内容</returns>
        public static string httppost(string URL, string strPostdata, string strEncoding)
        {
            Encoding encoding = Encoding.Default;
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(URL);
            request.Method = "post";
            request.Accept = "text/html, application/xhtml+xml, */*";
            request.ContentType = "application/x-www-form-urlencoded";
            byte[] buffer = encoding.GetBytes(strPostdata);
            request.ContentLength = buffer.Length;
            request.GetRequestStream().Write(buffer, 0, buffer.Length);
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            using (StreamReader reader = new StreamReader(response.GetResponseStream(), System.Text.Encoding.GetEncoding(strEncoding)))
            {
                return reader.ReadToEnd();
            }
        }
        /// <summary>
        /// post请求到指定地址并获取返回的信息内容
        /// </summary>
        /// <param name="url">请求地址</param>
        /// <param name="postData">请求参数</param>
        /// <param name="encodeType">编码类型如：UTF-8</param>
        /// <returns>返回响应内容</returns>
        public static string HttpPostContent(string POSTURL, string PostData)
        {
            //发送请求的数据
            WebRequest myHttpWebRequest = WebRequest.Create(POSTURL);
            myHttpWebRequest.Method = "POST";
            UTF8Encoding encoding = new UTF8Encoding();
            byte[] byte1 = encoding.GetBytes(PostData);
            myHttpWebRequest.ContentType = "application/x-www-form-urlencoded";
            myHttpWebRequest.ContentLength = byte1.Length;
            Stream newStream = myHttpWebRequest.GetRequestStream();
            newStream.Write(byte1, 0, byte1.Length);
            newStream.Close();

            //发送成功后接收返回的XML信息
            HttpWebResponse response = (HttpWebResponse)myHttpWebRequest.GetResponse();
            string lcHtml = string.Empty;
            Encoding enc = Encoding.GetEncoding("UTF-8");
            Stream stream = response.GetResponseStream();
            StreamReader streamReader = new StreamReader(stream, enc);
            lcHtml = streamReader.ReadToEnd();
            return lcHtml;
        } 
        /// <summary>
        /// 以GET方式抓取远程页面内容
        /// </summary>
        /// <param name="url">请求地址</param>
        /// <returns></returns>
        public static string Get_Http(string url)
        {
            string strResult;
            try
            {
                HttpWebRequest hwr = (HttpWebRequest)HttpWebRequest.Create(url);
                hwr.Timeout = 19600;
                HttpWebResponse hwrs = (HttpWebResponse)hwr.GetResponse();
                Stream myStream = hwrs.GetResponseStream();
                StreamReader sr = new StreamReader(myStream, Encoding.UTF8);
                StringBuilder sb = new StringBuilder();
                while (-1 != sr.Peek())
                {
                    sb.Append(sr.ReadLine() + "\r\n");
                }
                strResult = sb.ToString();
                hwrs.Close();
            }
            catch (Exception ee)
            {
                strResult = ee.Message;
            }
            return strResult;
        }
    }
}