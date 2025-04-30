<template>
    <a-modal class="msgbox" v-model:visible="dialogFormVisible" title="充值中心">
      <a-tabs
        v-model="activeName"
        :default-active-key="activeName"
        class="demo-tabs"
        type="capsule"
        @tab-click="handleClick"
      >
        <!-- 充值 Tab -->
        <a-tab-pane
          :title="'充值' + counter.setting.money_name_set"
          key="first"
          v-if="
            counter.setting.pay_wechat_open == '1' ||
            counter.setting.pay_alipay_open == '1' ||
            counter.setting.yzf_open == '1' ||
            counter.setting.airwallex_open == '1' ||
            counter.setting.crypto_open == '1'
          "
        >
          <!-- Airwallex Payment Containers -->
          <div v-if="isAirwallexMethod(form.pay_type)" class="airwallex-payment-container">
            <!-- Card Payment -->
            <template v-if="form.pay_type === 'airwallex_card'">
              <form :id="`airwallex-payment-form-${activeName}`">
                <div :id="getElementContainerId()" class="airwallex-card-element"></div>
                <button
                  type="button"
                  :id="getSubmitButtonId()"
                  class="airwallex-submit-button"
                  :disabled="charge_loading"
                >
                  Confirm Payment
                </button>
              </form>
            </template>
  
            <!-- Alipay -->
            <div v-if="form.pay_type === 'Alipay'" :id="getElementContainerId()" class="airwallex-qr-container">
              <div class="method-title">Airwallex Alipay</div>
            </div>
  
            <!-- WeChat Pay -->
            <div v-if="form.pay_type === 'WeChat Pay'" :id="getElementContainerId()" class="airwallex-qr-container">
              <div class="method-title">Airwallex WeChat Pay</div>
            </div>
  
            <!-- PayPal -->
            <div v-if="form.pay_type === 'airwallex_paypal'" :id="getElementContainerId()" class="airwallex-qr-container">
              <div class="method-title">Airwallex PayPal</div>
            </div>
          </div>
  
          <!-- Non-Airwallex QR Code -->
          <div v-if="qr_show && !isAirwallexMethod(form.pay_type)">
            <a-spin :loading="qr_load">
              <div class="qr_fing relative">
                <div class="absolute pay_over" v-if="qr_show && pay_now_type !== 'paying'">
                  <h4 class="text-white" v-if="pay_now_type === 'success'">
                    <p class="text-green-400 text-center"><icon-check /></p>
                    支付成功
                  </h4>
                  <h4 class="text-white" v-else-if="pay_now_type === 'time_out'">
                    <p class="text-red-400 text-center"><icon-close /></p>
                    超时未支付
                  </h4>
                </div>
                <qrcode-vue
                  v-if="qr_show"
                  :value="pay_scan"
                  size="240"
                  class="mt-2 mb-2 m-auto d-sm-block"
                />
                <h4 class="text-center time_in" v-if="qr_show">
                  「<a-countdown
                    :value="Date.now() + 5 * 60 * 1000"
                    format="HH:mm:ss"
                    :now="Date.now()"
                    :start="start"
                    @finish="handleFinish"
                  />」
                </h4>
              </div>
            </a-spin>
          </div>
  
          <!-- Recharge Form -->
          <a-form :model="form">
            <a-form-item label="充值">
              <a-input-number
                :step="0.01"
                v-model="form.amount"
                autocomplete="off"
                :precision="2"
                :min="parseFloat(counter.setting.min_recharge)"
                placeholder="请输入充值金额"
              />
            </a-form-item>
            
            <a-form-item label="支付方式">
              <a-radio-group v-model="form.pay_type">
                <!-- Non-Airwallex Methods -->
                <a-radio v-if="counter.setting.pay_wechat_open == '1'" value="wechat">微信</a-radio>
                <a-radio v-if="counter.setting.pay_alipay_open == '1'" value="alipay">支付宝</a-radio>
                <a-radio 
                  v-if="counter.setting.yzf_open == '1' && counter.setting.yzf_wechat_open == '1'"
                  value="yzf_wechat"
                >微信</a-radio>
                <a-radio 
                  v-if="counter.setting.yzf_open == '1' && counter.setting.yzf_alipay_open == '1'"
                  value="yzf_alipay"
                >支付宝</a-radio>
  
                <!-- Airwallex Methods -->
                <a-radio-group v-if="counter.setting.airwallex_open == '1'">
                  <a-radio value="airwallex_card">Airwallex - Card (Visa, etc.)</a-radio>
                  <a-radio value="Alipay">Airwallex Alipay</a-radio>
                  <a-radio value="AlipayHK">Airwallex AlipayHK</a-radio>
                  <a-radio value="WeChat Pay">Airwallex WeChat Pay</a-radio>
                  <a-radio value="WeChat PayHK">Airwallex WeChat PayHK</a-radio>
                  <a-radio value="airwallex_paypal">Airwallex - PayPal</a-radio>
                </a-radio-group>
  
                <a-radio v-if="counter.setting.crypto_open == '1'" value="crypto">Crypto (BTC/ETH)</a-radio>
                <a-radio value="balance">{{ counter.setting.money_name_set }}</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-form>
        </a-tab-pane>
  
        <!-- VIP Tab -->
        <a-tab-pane title="开通VIP" key="second">
          <!-- VIP Content -->
          <div v-if="isAirwallexMethod(form.pay_type)" class="airwallex-payment-container">
            <!-- Same Airwallex containers as above -->
          </div>
  
          <a-form :model="form">
            <a-form-item label="购买会员">
              <a-radio-group @change="changeRadio" v-model="form.vip_type">
                <!-- VIP Options -->
              </a-radio-group>
            </a-form-item>
            
            <a-form-item label="支付方式">
              <!-- Same payment method radios as above -->
            </a-form-item>
            
            <a-form-item label="优惠卷">
              <a-input v-model="form.kami" placeholder="请输入优惠卷码"></a-input>
            </a-form-item>
          </a-form>
        </a-tab-pane>
  
        <!-- 次数包 Tab -->
        <a-tab-pane title="次数包" key="third">
          <a-form :model="form">
            <a-form-item label="购买">
              <a-radio-group @change="changeLimitRadio" v-model="form.limit_bag_id">
                <!-- Package Options -->
              </a-radio-group>
            </a-form-item>
            
            <a-form-item label="支付方式">
              <a-radio-group v-model="form.pay_type">
                <a-radio value="balance">{{ counter.setting.money_name_set }}</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
  
      <template #footer>
        <a-space class="dialog-footer">
          <a-button type="primary" @click="is_vipor_charge()" :loading="charge_loading">立即充值</a-button>
          <a-button type="primary" plain @click="dialogm()">完成支付</a-button>
        </a-space>
      </template>
    </a-modal>
  </template>





<script setup lang="ts">
import { nextTick } from "vue";
const { $airwallex } = useNuxtApp();

interface AirwallexInstance {
  init: (config: { env: string; origin: string }) => void;
  createElement: (type: string, config: any) => {
    mount: (elementId: string) => void;
    on: (event: string, handler: (data?: any) => void) => void;
    unmount: () => void;
  };
  confirmPaymentIntent: (config: any) => Promise<{ status: string }>;
  destroyElement: () => void;
}

const airwallex = $airwallex as AirwallexInstance | null;
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { reactive, ref, computed, onMounted, onUnmounted } from "vue";
import QrcodeVue from "qrcode.vue";
import { useCounter } from "~/store/counter";
import { Message } from "@arco-design/web-vue";
import { IconCheck, IconClose } from "@arco-design/web-vue/es/icon";
import {
  buy_limit_bags,
  charge_limit_bag,
  airwallexPay,
  get_nav_config,
  alipay,
  wechat,
  check_order_status,
  get_vip_show,
  cryptomusPay,
  get_user,
} from "~/utils/api";

interface VipItem {
  id: string;
  pay_amount: number;
  end_time: number;
  title: string;
  type: string;
  limit_send: number;
  limit_draw: number;
  discount_price?: number;
}

interface LimitPackage {
  id: string;
  title: string;
  qs: number;
  draw: number;
  cost: number;
}

const counter = useCounter();
const props = defineProps({ dialogFormVisible: { type: Boolean, default: false } });
const emit = defineEmits(["payment-success", "handleCancels"]);
const route = useRoute();
const router = useRouter();

const airwallexPaymentTypes = [
  "airwallex_card",
  "Alipay",
  "AlipayHK",
  "WeChat Pay",
  "WeChat PayHK",
  "airwallex_paypal"
];

const qrcodeMethodMap = {
  Alipay: "alipay",
  AlipayHK: "alipay_hk",
  "WeChat Pay": "wechat",
  "WeChat PayHK": "wechat",
  airwallex_paypal: "paypal"
};

const activeName = ref(counter.setting.pay_wechat_open === "1" ? "first" : "second");
const pay_now_type = ref("paying");
const start = ref(false);
const qr_load = ref(false);
const pay_scan = ref("");
const charge_loading = ref(false);
const qr_show = ref(false);
const showAirwallexForm = ref(false);
const time_check_status = ref<NodeJS.Timeout>();
const vip_list = ref<VipItem[]>([]);
const vip_ids = ref("");
const vip_now_money = ref(0);
const limit_list = ref<LimitPackage[]>([]);
const airwallexElement = ref<any>(null);
const airwallexSubmitListener = ref<(() => void) | null>(null);

const form = reactive({
  amount: counter.setting.min_recharge ? parseFloat(counter.setting.min_recharge) : 1,
  pay_type: "",
  vip_type: 1,
  kami: "",
  limit_bag_id: ""
});

const isAirwallexMethod = (payType: string) => airwallexPaymentTypes.includes(payType);

const refreshUserInfo = async () => {
  try {
    await get_user();
  } catch (error) {
    Message.error("无法更新用户信息");
  }
};

const setDefaultPayType = () => {
  const methods = [];
  if (counter.setting.pay_wechat_open === "1") methods.push("wechat");
  if (counter.setting.pay_alipay_open === "1") methods.push("alipay");
  if (counter.setting.yzf_open === "1" && counter.setting.yzf_wechat_open === "1") methods.push("yzf_wechat");
  if (counter.setting.yzf_open === "1" && counter.setting.yzf_alipay_open === "1") methods.push("yzf_alipay");
  if (counter.setting.airwallex_open === "1") methods.push("airwallex_card");
  if (counter.setting.crypto_open === "1") methods.push("crypto");
  form.pay_type = methods[0] || "";
};

watch(() => route.query.payment, (newVal) => {
  if (newVal === "success") {
    Message.success("Payment successful!");
    refreshUserInfo();
    emit("payment-success");
    dialogFormVisible.value = false;
  }
  router.replace({ query: { ...route.query, payment: null, balance: null } });
});

onMounted(async () => {
  if (counter.setting?.airwallex_open === "1" && !airwallex) {
    Message.error("Airwallex payment unavailable");
  }
  fetchSettings();
  get_limit_bag();
});

onUnmounted(() => {
  cleanupAirwallex();
  time_check_status.value && clearInterval(time_check_status.value);
});

const initializeAirwallex = async () => {
  if (counter.setting?.airwallex_open !== "1" || !airwallex) return;
  console.log("Airwallex initialized:", airwallex);
};

const cleanupAirwallex = () => {
  if (airwallexElement.value && airwallex) {
    try {
      airwallexElement.value.unmount();
      airwallex.destroyElement();
    } catch (error) {
      console.warn("Airwallex cleanup error:", error);
    }
    airwallexElement.value = null;
  }
  if (airwallexSubmitListener.value) {
    document.getElementById(getSubmitButtonId())?.removeEventListener("click", airwallexSubmitListener.value);
    airwallexSubmitListener.value = null;
  }
};

const getElementContainerId = () => {
  const tabSuffix = activeName.value === "first" ? "first" : "second";
  return form.pay_type === "airwallex_card" 
    ? `airwallex-card-container-${tabSuffix}` 
    : `airwallex-qr-code-container-${tabSuffix}`;
};

const getSubmitButtonId = () => `airwallex-submit-${activeName.value === "first" ? "first" : "second"}`;

const handleAirwallexPayment = async (intentData: any) => {
  if (!airwallex) return;

  cleanupAirwallex();
  const containerId = getElementContainerId();
  await waitForElement(containerId);

  try {
    if (form.pay_type === "airwallex_card") {
      airwallexElement.value = airwallex.createElement("card", {
        intent: {
          id: intentData.payment_intent_id,
          client_secret: intentData.client_secret
        },
        autoCapture: true
      });

      airwallexElement.value.mount(containerId);
      
      const submitButton = document.getElementById(getSubmitButtonId());
      if (submitButton) {
        airwallexSubmitListener.value = async () => {
          charge_loading.value = true;
          try {
            const result = await airwallex.confirmPaymentIntent({
              element: airwallexElement.value,
              payment_intent_id: intentData.payment_intent_id,
              client_secret: intentData.client_secret
            });
            result.status === "SUCCEEDED" ? handlePaymentSuccess() : Message.error(`Payment failed: ${result.status}`);
          } finally {
            charge_loading.value = false;
          }
        };
        submitButton.addEventListener("click", airwallexSubmitListener.value);
      }
    } else {
      const method = qrcodeMethodMap[form.pay_type];
      if (!method) throw new Error("Invalid payment method");
      
      airwallexElement.value = airwallex.createElement("qrcode", {
        intent: {
          id: intentData.payment_intent_id,
          client_secret: intentData.client_secret
        },
        method
      });

      airwallexElement.value.mount(containerId);
      airwallexElement.value.on("success", handlePaymentSuccess);
      airwallexElement.value.on("error", (error: any) => Message.error(`Payment failed: ${error.message}`));
    }
  } catch (error) {
    Message.error("Payment setup failed");
  }
};

const waitForElement = (id: string, timeout = 5000) => new Promise<void>((resolve, reject) => {
  const start = Date.now();
  const check = () => {
    document.getElementById(id) ? resolve() : 
    Date.now() - start > timeout ? reject() : setTimeout(check, 100);
  };
  check();
});

const startPaymentStatusCheck = (orderId: string, qrCode: string) => {
  start.value = true;
  pay_now_type.value = "paying";
  pay_scan.value = qrCode;
  qr_show.value = true;

  time_check_status.value = setInterval(async () => {
    try {
      const res = await check_order_status({ order_id: orderId });
      if (res._rawValue.status === 200) {
        clearInterval(time_check_status.value);
        pay_now_type.value = "success";
        handlePaymentSuccess();
      }
    } catch {
      clearInterval(time_check_status.value);
      pay_now_type.value = "time_out";
    }
  }, 5000);
};

const handlePaymentSuccess = () => {
  pay_now_type.value = "success";
  start.value = false;
  refreshUserInfo();
  dialogFormVisible.value = false;
  emit("payment-success");
};

const startAirwallexPayment = async (type: string, params: any) => {
  charge_loading.value = true;
  qr_show.value = false;
  
  try {
    const res = await airwallexPay({ ...params, type, payment_method: form.pay_type });
    showAirwallexForm.value = true;
    await nextTick();
    await handleAirwallexPayment(res._rawValue);
  } finally {
    charge_loading.value = false;
  }
};

const processPayment = async (paymentMethod: Function, mobileCheck: boolean) => {
  const res = await paymentMethod();
  if (mobileCheck && /Mobile|Android|iOS/.test(navigator.userAgent)) {
    window.location.href = res._rawValue.pay_url;
  } else {
    startPaymentStatusCheck(res._rawValue.order_id, res._rawValue.qr_code);
  }
};

const send_charge = async () => {
  if (form.amount <= 0) return Message.error("请输入有效的充值金额");
  
  if (isAirwallexMethod(form.pay_type)) {
    await startAirwallexPayment("charge", { amount: form.amount });
  } else {
    qr_load.value = true;
    switch (form.pay_type) {
      case "alipay":
        await processPayment(() => alipay({
          amount: form.amount,
          type: "charge",
          is_mobile: counter.setting.alipay_wap_open === "1" ? 1 : 0
        }), true);
        break;
      case "wechat":
        await processPayment(() => wechat({
          amount: form.amount,
          type: "charge",
          is_mobile: counter.setting.wechat_open === "1" ? 1 : 0
        }), true);
        break;
      case "crypto":
        const cryptoRes = await cryptomusPay({ amount: form.amount, type: "charge" });
        startPaymentStatusCheck(cryptoRes._rawValue.order_id, cryptoRes._rawValue.qr_code);
        break;
      default:
        Message.error("未选择的支付方式");
    }
  }
};

const up_to_vip = async () => {
  if (!vip_ids.value) return Message.error("请选择VIP套餐");
  
  if (isAirwallexMethod(form.pay_type)) {
    await startAirwallexPayment("vip", {
      v_id: vip_ids.value,
      amount: vip_now_money.value,
      coupon: form.kami
    });
  } else if (form.pay_type === "crypto") {
    const cryptoRes = await cryptomusPay({
      v_id: vip_ids.value,
      amount: vip_now_money.value,
      type: "vip",
      coupon: form.kami
    });
    startPaymentStatusCheck(cryptoRes._rawValue.order_id, cryptoRes._rawValue.qr_code);
  }
};

const fetchSettings = async () => {
  try {
    const res = await get_nav_config();
    counter.setting = res._rawValue.data;
    await get_vip();
    setDefaultPayType();
  } catch {
    Message.error("获取设置失败");
  }
};

const get_vip = async () => {
  try {
    const res = await get_vip_show();
    vip_list.value = res._rawValue.data;
    vip_ids.value = res._rawValue.data[0]?.id;
    vip_now_money.value = res._rawValue.data[0]?.pay_amount || 0;
  } catch {
    Message.error("获取VIP信息失败");
  }
};

const get_limit_bag = async () => {
  try {
    const res = await charge_limit_bag();
    limit_list.value = res._rawValue.data;
    form.limit_bag_id = res._rawValue.data[0]?.id;
  } catch (error) {
    console.error("获取次数包失败:", error);
  }
};

const check_vip_type = (type: string) => ({
  free: "免费版", day: "每日", month: "每月", total: "有效期内"
})[type] || "免费版";

const changeRadio = (e: string) => {
  const selected = vip_list.value.find(item => item.id === e);
  if (selected) {
    vip_ids.value = selected.id;
    vip_now_money.value = selected.pay_amount;
  }
};

const is_vipor_charge = () => {
  if (!form.pay_type) return Message.error("请选择支付方式");
  activeName.value === "first" ? send_charge() :
  activeName.value === "second" ? up_to_vip() : buy_limit_bag();
};

const buy_limit_bag = async () => {
  try {
    charge_loading.value = true;
    await buy_limit_bags({ id: form.limit_bag_id });
    dialogFormVisible.value = false;
    emit("payment-success");
  } finally {
    charge_loading.value = false;
  }
};

const dialogFormVisible = computed({
  get() { return props.dialogFormVisible },
  set(val) { emit("handleCancels", val) }
});

const handleClick = (tab: any) => {
  activeName.value = tab;
  form.pay_type = "";
  setDefaultPayType();
};

const handleFinish = () => pay_now_type.value = "time_out";
const dialogm = () => { dialogFormVisible.value = false; cleanupAirwallex(); };
const changeLimitRadio = (e: string) => form.limit_bag_id = e;
</script>




<style scoped>
.airwallex-payment-container {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin: 20px 0;
}

.airwallex-card-element {
  min-height: 120px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 15px;
}

.airwallex-submit-button {
  width: 100%;
  padding: 12px 24px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.airwallex-submit-button:disabled {
  background: #8c8c8c;
  cursor: not-allowed;
}

.method-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 15px;
  color: #333;
}

.qr-code-container {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
}

.qr_fing {
  position: relative;
}

.pay_over {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.time_in {
  margin-top: 15px;
  font-size: 14px;
  color: #666;
}
</style>