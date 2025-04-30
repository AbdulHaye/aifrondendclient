// ~/utils/paymentHandlers.ts
import { ref } from 'vue';
import { Message } from "@arco-design/web-vue";
import { alipay, wechat, yzf_pay, airwallex_pay, virtual_currency_pay, check_order_status, buy_vip } from "~/utils/api";
import type { Counter } from '~/store/counter'; // Import the type only

export interface PaymentParams {
  amount?: number;
  v_id?: string;
  type: 'charge' | 'vip';
  coupon?: string;
  pay_scan?: any; // Ref<string>
  payment_in_progress?: any; // Ref<boolean>
  start?: any; // Ref<boolean>
  pay_now_type?: any; // Ref<string>
  time_check_status?: any; // Ref<any>
  charge_loading?: any; // Ref<boolean>
  qr_load?: any; // Ref<boolean>
  crypto_amount?: any; // Ref<string>
  crypto_currency?: any; // Ref<string>
  crypto_address?: any; // Ref<string>
  counter: Counter; // Add counter as a required parameter
}

type PaymentHandler = (params: PaymentParams) => Promise<void>;

const isMobile = /Mobile|Android|iOS/.test(navigator.userAgent);

export const paymentHandlers: Record<string, PaymentHandler> = {
  wechat: async (params) => {
    const { amount, v_id, type, coupon, pay_scan, payment_in_progress, start, pay_now_type, time_check_status, charge_loading, qr_load, counter } = params;
    charge_loading!.value = true;
    qr_load!.value = true;
    const isWapOpen = counter.setting.wechat_wap_open == '1';
    try {
      const res = await wechat({
        amount,
        v_id,
        type,
        coupon,
        is_mobile: isMobile && isWapOpen ? 1 : 0
      });
      if (isMobile && isWapOpen) {
        payment_in_progress!.value = false;
        window.location.href = res._rawValue.pay_url;
      } else {
        payment_in_progress!.value = true;
        start!.value = true;
        pay_now_type!.value = 'paying';
        pay_scan!.value = res._rawValue.qr_code;
        time_check_status!.value = setInterval(async () => {
          try {
            const statusRes = await check_order_status({ order_id: res._rawValue.order_id });
            if (statusRes._rawValue.status == 200) {
              clearInterval(time_check_status!.value);
              pay_now_type!.value = 'success';
              Message.success(type === 'charge' ? '充值成功' : '升级VIP成功');
              start!.value = false;
            }
          } catch (err) {
            clearInterval(time_check_status!.value);
            console.log(err);
          }
        }, 5000);
      }
      charge_loading!.value = false;
      qr_load!.value = false;
    } catch (err: any) {
      charge_loading!.value = false;
      qr_load!.value = false;
      payment_in_progress!.value = false;
      console.log(err.message);
    }
  },
  alipay: async (params) => {
    const { amount, v_id, type, coupon, pay_scan, payment_in_progress, start, pay_now_type, time_check_status, charge_loading, qr_load, counter } = params;
    charge_loading!.value = true;
    qr_load!.value = true;
    const isWapOpen = counter.setting.alipay_wap_open == '1';
    try {
      const res = await alipay({
        amount,
        v_id,
        type,
        coupon,
        is_mobile: isMobile && isWapOpen ? 1 : 0
      });
      if (isMobile && isWapOpen) {
        payment_in_progress!.value = false;
        window.location.href = res._rawValue.pay_url;
      } else {
        payment_in_progress!.value = true;
        start!.value = true;
        pay_now_type!.value = 'paying';
        pay_scan!.value = res._rawValue.qr_code;
        time_check_status!.value = setInterval(async () => {
          try {
            const statusRes = await check_order_status({ order_id: res._rawValue.order_id });
            if (statusRes._rawValue.status == 200) {
              clearInterval(time_check_status!.value);
              pay_now_type!.value = 'success';
              Message.success(type === 'charge' ? '充值成功' : '升级VIP成功');
              start!.value = false;
            }
          } catch (err) {
            clearInterval(time_check_status!.value);
            console.log(err);
          }
        }, 5000);
      }
      charge_loading!.value = false;
      qr_load!.value = false;
    } catch (err: any) {
      charge_loading!.value = false;
      qr_load!.value = false;
      payment_in_progress!.value = false;
      console.log(err.message);
    }
  },
  yzf_wechat: async (params) => {
    const { amount, v_id, type, coupon, payment_in_progress, charge_loading, qr_load } = params;
    charge_loading!.value = true;
    qr_load!.value = true;
    payment_in_progress!.value = false;
    try {
      const res = await yzf_pay({
        amount,
        v_id,
        type,
        coupon,
        pay_type: 'wxpay',
      });
      const formDiv = document.createElement('div');
      formDiv.innerHTML = res._rawValue.data;
      document.body.appendChild(formDiv);
      document.getElementById("dopay")?.submit();
      charge_loading!.value = false;
      qr_load!.value = false;
    } catch (err: any) {
      charge_loading!.value = false;
      qr_load!.value = false;
      console.log(err.message);
    }
  },
  yzf_alipay: async (params) => {
    const { amount, v_id, type, coupon, payment_in_progress, charge_loading, qr_load } = params;
    charge_loading!.value = true;
    qr_load!.value = true;
    payment_in_progress!.value = false;
    try {
      const res = await yzf_pay({
        amount,
        v_id,
        type,
        coupon,
        pay_type: 'alipay',
      });
      const formDiv = document.createElement('div');
      formDiv.innerHTML = res._rawValue.data;
      document.body.appendChild(formDiv);
      document.getElementById("dopay")?.submit();
      charge_loading!.value = false;
      qr_load!.value = false;
    } catch (err: any) {
      charge_loading!.value = false;
      qr_load!.value = false;
      console.log(err.message);
    }
  },
  airwallex: async (params) => {
    const { amount, v_id, type, coupon, payment_in_progress, start, pay_now_type, time_check_status, charge_loading, qr_load } = params;
    charge_loading!.value = true;
    qr_load!.value = true;
    payment_in_progress!.value = true;
    try {
      const res = await airwallex_pay({
        amount,
        v_id,
        type,
        coupon,
      });
      window.open(res._rawValue.payment_url, '_blank');
      start!.value = true;
      pay_now_type!.value = 'paying';
      time_check_status!.value = setInterval(async () => {
        try {
          const statusRes = await check_order_status({ order_id: res._rawValue.order_id });
          if (statusRes._rawValue.status == 200) {
            clearInterval(time_check_status!.value);
            pay_now_type!.value = 'success';
            Message.success(type === 'charge' ? '充值成功' : '升级VIP成功');
            start!.value = false;
          }
        } catch (err) {
          clearInterval(time_check_status!.value);
          console.log(err);
        }
      }, 5000);
      charge_loading!.value = false;
      qr_load!.value = false;
    } catch (err: any) {
      charge_loading!.value = false;
      qr_load!.value = false;
      payment_in_progress!.value = false;
      console.log(err.message);
    }
  },
  virtual_currency: async (params) => {
    const { amount, v_id, type, coupon, payment_in_progress, start, pay_now_type, time_check_status, charge_loading, qr_load, crypto_amount, crypto_currency, crypto_address } = params;
    charge_loading!.value = true;
    qr_load!.value = true;
    payment_in_progress!.value = true;
    try {
      const res = await virtual_currency_pay({
        amount,
        v_id,
        type,
        coupon,
      });
      crypto_amount!.value = res._rawValue.crypto_amount;
      crypto_currency!.value = res._rawValue.crypto_currency;
      crypto_address!.value = res._rawValue.crypto_address;
      start!.value = true;
      pay_now_type!.value = 'paying';
      time_check_status!.value = setInterval(async () => {
        try {
          const statusRes = await check_order_status({ order_id: res._rawValue.order_id });
          if (statusRes._rawValue.status == 200) {
            clearInterval(time_check_status!.value);
            pay_now_type!.value = 'success';
            Message.success(type === 'charge' ? '充值成功' : '升级VIP成功');
            start!.value = false;
          }
        } catch (err) {
          clearInterval(time_check_status!.value);
          console.log(err);
        }
      }, 5000);
      charge_loading!.value = false;
      qr_load!.value = false;
    } catch (err: any) {
      charge_loading!.value = false;
      qr_load!.value = false;
      payment_in_progress!.value = false;
      console.log(err.message);
    }
  },
  balance: async (params) => {
    const { v_id, coupon, charge_loading } = params;
    charge_loading!.value = true;
    try {
      const res = await buy_vip({
        v_id,
        coupon,
      });
      charge_loading!.value = false;
      Message.success(res._rawValue.message);
    } catch (err: any) {
      charge_loading!.value = false;
      console.log(err.message);
    }
  },
};