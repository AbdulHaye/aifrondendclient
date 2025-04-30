<template>
  <a-modal class="msgbox" v-model:visible="dialogFormVisible" title="充值中心">
    <a-tabs
      v-model="activeName"
      :default-active-key="activeName"
      class="demo-tabs"
      type="capsule"
      @tab-click="handleClick"
    >
      <!-- "充值" Tab (key="first") -->
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
        <!-- Static Airwallex Payment Container -->
        <div
          class="airwallex-payment-container"
          :class="{
            hidden: !isAirwallexMethod(form.pay_type) || !showAirwallexForm,
          }"
        >
          <div id="airwallex-payment-element-first"></div>
        </div>
        <!-- QR code display (only for non-Airwallex methods) -->
        <div v-if="qr_show && !isAirwallexMethod(form.pay_type)">
          <a-spin :loading="qr_load">
            <div class="qr_fing relative">
              <div
                class="absolute pay_over"
                v-if="qr_show && pay_now_type !== 'paying'"
              >
                <h4 class="text-white" v-if="pay_now_type === 'success'">
                  <p class="text-green-400 text-center">
                    <icon-check />
                  </p>
                  支付成功
                </h4>
                <h4 class="text-white" v-else-if="pay_now_type === 'time_out'">
                  <p class="text-red-400 text-center">
                    <icon-close />
                  </p>
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
              <a-radio
                v-if="counter.setting.pay_wechat_open == '1'"
                value="wechat"
                >微信</a-radio
              >
              <a-radio
                v-if="counter.setting.pay_alipay_open == '1'"
                value="alipay"
                >支付宝</a-radio
              >
              <a-radio
                v-if="
                  counter.setting.yzf_open == '1' &&
                  counter.setting.yzf_wechat_open == '1'
                "
                value="yzf_wechat"
                >微信</a-radio
              >
              <a-radio
                v-if="
                  counter.setting.yzf_open == '1' &&
                  counter.setting.yzf_alipay_open == '1'
                "
                value="yzf_alipay"
                >支付宝</a-radio
              >
              <a-radio
                v-if="counter.setting.airwallex_open == '1'"
                value="airwallex_card"
                >Airwallex - Card (Visa, etc.)</a-radio
              >
              <a-radio
                v-if="counter.setting.airwallex_open == '1'"
                value="Alipay"
                >Airwallex Alipay</a-radio
              >
              <a-radio
                v-if="counter.setting.airwallex_open == '1'"
                value="AlipayHK"
                >Airwallex AlipayHK</a-radio
              >
              <a-radio
                v-if="counter.setting.airwallex_open == '1'"
                value="WeChat Pay"
                >Airwallex WeChat Pay</a-radio
              >
              <a-radio
                v-if="counter.setting.airwallex_open == '1'"
                value="WeChat PayHK"
                >Airwallex WeChat PayHK</a-radio
              >
              <a-radio
                v-if="counter.setting.airwallex_open == '1'"
                value="airwallex_paypal"
                >Airwallex - PayPal</a-radio
              >
              <a-radio v-if="counter.setting.crypto_open == '1'" value="crypto"
                >Crypto (BTC/ETH)</a-radio
              >
              <a-radio value="balance">{{
                counter.setting.money_name_set
              }}</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-form>
      </a-tab-pane>

      <!-- "开通VIP" Tab (key="second") -->
      <a-tab-pane title="开通VIP" key="second">
        <!-- Static Airwallex Payment Container -->
        <div
          class="airwallex-payment-container"
          :class="{
            hidden: !isAirwallexMethod(form.pay_type) || !showAirwallexForm,
          }"
        >
          <div id="airwallex-payment-element-second"></div>
        </div>
        <!-- QR code display -->
        <div v-if="qr_show && !isAirwallexMethod(form.pay_type)">
          <a-spin :loading="qr_load">
            <div class="qr_fing relative">
              <div
                class="absolute pay_over"
                v-if="qr_show && pay_now_type !== 'paying'"
              >
                <h4 class="text-white" v-if="pay_now_type === 'success'">
                  <p class="text-green-400 text-center">
                    <icon-check />
                  </p>
                  支付成功
                </h4>
                <h4 class="text-white" v-else-if="pay_now_type === 'time_out'">
                  <p class="text-red-400 text-center">
                    <icon-close />
                  </p>
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
        <a-form :model="form">
          <a-form-item label="购买会员">
            <a-radio-group @change="changeRadio" v-model="form.vip_type">
              <template v-for="(item, index) in vip_list" :key="index">
                <a-radio :value="item.id" class="w-40">
                  <template #radio="{ checked }">
                    <a-space
                      align="start"
                      class="custom-radio-card"
                      :class="{ 'custom-radio-card-checked': checked }"
                    >
                      <div className="custom-radio-card-mask">
                        <div className="custom-radio-card-mask-dot" />
                      </div>
                      <div>
                        <div>{{ item.end_time }} 天</div>
                        <div className="custom-radio-card-title mt-2">
                          {{ item.title }}
                        </div>
                        <div>
                          <p>
                            {{ check_vip_type(item.type) }}问答:{{
                              item.limit_send
                            }}
                          </p>
                          {{ check_vip_type(item.type) }}绘画:{{
                            item.limit_draw
                          }}
                        </div>
                        <a-typography-text type="secondary">
                          <div v-if="item.discount_price">
                            <del>￥{{ item.pay_amount }}</del> ￥{{
                              item.discount_price
                            }}
                          </div>
                          <div v-else>￥{{ item.pay_amount }}</div>
                        </a-typography-text>
                      </div>
                    </a-space>
                  </template>
                </a-radio>
              </template>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="支付方式">
            <a-radio-group v-model="form.pay_type">
              <a-radio
                v-if="counter.setting.pay_wechat_open == '1'"
                value="wechat"
                >微信</a-radio
              >
              <a-radio
                v-if="counter.setting.pay_alipay_open == '1'"
                value="alipay"
                >支付宝</a-radio
              >
              <a-radio
                v-if="
                  counter.setting.yzf_open == '1' &&
                  counter.setting.yzf_wechat_open == '1'
                "
                value="yzf_wechat"
                >微信</a-radio
              >
              <a-radio
                v-if="
                  counter.setting.yzf_open == '1' &&
                  counter.setting.yzf_alipay_open == '1'
                "
                value="yzf_alipay"
                >支付宝</a-radio
              >
              <a-radio
                v-if="counter.setting.airwallex_open == '1'"
                value="airwallex_card"
                >Airwallex - Card (Visa, etc.)</a-radio
              >
              <a-radio
                v-if="counter.setting.airwallex_open == '1'"
                value="Alipay"
                >Airwallex Alipay</a-radio
              >
              <a-radio
                v-if="counter.setting.airwallex_open == '1'"
                value="AlipayHK"
                >Airwallex AlipayHK</a-radio
              >
              <a-radio
                v-if="counter.setting.airwallex_open == '1'"
                value="WeChat Pay"
                >Airwallex WeChat Pay</a-radio
              >
              <a-radio
                v-if="counter.setting.airwallex_open == '1'"
                value="WeChat PayHK"
                >Airwallex WeChat PayHK</a-radio
              >
              <a-radio
                v-if="counter.setting.airwallex_open == '1'"
                value="airwallex_paypal"
                >Airwallex - PayPal</a-radio
              >
              <a-radio v-if="counter.setting.crypto_open == '1'" value="crypto"
                >Crypto (BTC/ETH)</a-radio
              >
              <a-radio value="balance">{{
                counter.setting.money_name_set
              }}</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="优惠卷">
            <a-input v-model="form.kami" placeholder="请输入优惠卷码"></a-input>
          </a-form-item>
        </a-form>
      </a-tab-pane>

      <!-- "次数包" Tab (key="third") -->
      <a-tab-pane title="次数包" key="third">
        <a-form :model="form">
          <a-form-item label="购买">
            <a-radio-group
              @change="changeLimitRadio"
              v-model="form.limit_bag_id"
            >
              <template v-for="(item, index) in limit_list" :key="index">
                <a-radio :value="item.id" class="w-40">
                  <template #radio="{ checked }">
                    <a-space
                      align="start"
                      class="custom-radio-card"
                      :class="{ 'custom-radio-card-checked': checked }"
                    >
                      <div className="custom-radio-card-mask">
                        <div className="custom-radio-card-mask-dot" />
                      </div>
                      <div>
                        <div className="custom-radio-card-title mt-2">
                          {{ item.title }}
                        </div>
                        <div>
                          <p>问答:{{ item.qs }}</p>
                          绘画:{{ item.draw }}
                        </div>
                        <a-typography-text type="secondary"
                          >￥{{ item.cost }}</a-typography-text
                        >
                      </div>
                    </a-space>
                  </template>
                </a-radio>
              </template>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="支付方式">
            <a-radio-group v-model="form.pay_type">
              <a-radio value="balance">{{
                counter.setting.money_name_set
              }}</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-form>
      </a-tab-pane>
    </a-tabs>
    <template #footer>
      <a-space class="dialog-footer">
        <a-button
          type="primary"
          @click="is_vipor_charge()"
          :loading="charge_loading"
          >立即充值</a-button
        >
        <a-button type="primary" plain @click="dialogm()">完成支付</a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, ref, onMounted, onUnmounted } from "vue";
const { $airwallex } = useNuxtApp();

interface AirwallexInstance {
  init: (config: { env: string; origin: string }) => void;
  createElement: (
    type: string,
    config: any
  ) => {
    mount: (elementId: string) => void;
    on: (event: string, handler: (data?: any) => void) => void;
    unmount: () => void;
  };
  confirmPaymentIntent: (config: any) => Promise<{ status: string }>;
  destroyElement: () => void;
  redirectToCheckout: (config: {
    env: string;
    intent_id: string;
    client_secret: string;
    currency: string;
    locale?: string;
  }) => void;
}

const airwallex = $airwallex as AirwallexInstance | null;
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { reactive, computed } from "vue";
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
const props = defineProps({
  dialogFormVisible: { type: Boolean, default: false },
});

const emit = defineEmits(["payment-success", "handleCancels"]);

const activeName = ref(
  counter.setting.pay_wechat_open === "1" ? "first" : "second"
);
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

const airwallexPaymentTypes = [
  "airwallex_card",
  "Alipay",
  "AlipayHK",
  "WeChat Pay",
  "WeChat PayHK",
  "airwallex_paypal",
];

// const getAirwallexElementType = (
//   payType: string
// ): { type: string; paymentMethod?: string; redirect?: boolean } => {
//   console.log(`Mapping pay_type: ${payType}`);
//   switch (payType) {
//     case "airwallex_card":
//       return { type: "card" }; // Embedded
//     case "Alipay":
//       return { type: "dropin", paymentMethod: "alipay", redirect: true }; // Fallback to redirect if dropin fails
//     case "AlipayHK":
//       return { type: "dropin", paymentMethod: "alipayhk", redirect: true };
//     case "WeChat Pay":
//       return { type: "dropin", paymentMethod: "wechat", redirect: true };
//     case "WeChat PayHK":
//       return { type: "dropin", paymentMethod: "wechat", redirect: true };
//     case "airwallex_paypal":
//       return { type: "dropin", paymentMethod: "paypal", redirect: true };
//     default:
//       console.warn(`Unhandled pay_type: ${payType}, defaulting to dropin`);
//       return { type: "dropin" }; // Default embedded dropin
//   }
// };
// const getAirwallexElementType = (
//   payType: string
// ): { type: string; paymentMethod?: string } => {
//   console.log(`Mapping pay_type: ${payType}`);
//   switch (payType) {
//     case "airwallex_card":
//       return { type: "card" }; // Embedded card form
//     case "Alipay":
//       return { type: "dropin", paymentMethod: "alipay" };
//     case "AlipayHK":
//       return { type: "dropin", paymentMethod: "alipayhk" };
//     case "WeChat Pay":
//       return { type: "dropin", paymentMethod: "wechat" };
//     case "WeChat PayHK":
//       return { type: "dropin", paymentMethod: "wechat" };
//     case "airwallex_paypal":
//       return { type: "dropin", paymentMethod: "paypal" };
//     default:
//       console.warn(`Unhandled pay_type: ${payType}, defaulting to dropin`);
//       return { type: "dropin" }; // Default to dropin for safety
//   }
// };
const getAirwallexElementType = (
  payType: string
): { type: string; paymentMethod?: string } => {
  console.log(`Mapping pay_type: ${payType}`);
  switch (payType) {
    case "airwallex_card":
      return { type: "card" }; // Embedded card form
    case "Alipay":
    case "AlipayHK":
    case "WeChat Pay":
    case "WeChat PayHK":
      return { type: "qrCode" };
    case "airwallex_paypal":
      return { type: "dropin", paymentMethod: "paypal" };
    default:
      console.warn(`Unhandled pay_type: ${payType}, defaulting to dropin`);
      return { type: "dropin" }; // Default to dropin for safety
  }
};

const isAirwallexMethod = (payType: string) => {
  return airwallexPaymentTypes.includes(payType);
};

const form = reactive({
  amount: counter.setting.min_recharge
    ? parseFloat(counter.setting.min_recharge)
    : 1,
  pay_type: "",
  vip_type: 1,
  kami: "",
  limit_bag_id: "",
});

const refreshUserInfo = async () => {
  try {
    const response = await get_user();
    const userData = response._rawValue.data;
    console.log("User info refreshed:", userData);
  } catch (error) {
    console.error("Failed to refresh user info:", error);
    Message.error("无法更新用户信息");
  }
};

const setDefaultPayType = () => {
  const availableMethods = [];
  if (counter.setting.pay_wechat_open === "1") availableMethods.push("wechat");
  if (counter.setting.pay_alipay_open === "1") availableMethods.push("alipay");
  if (
    counter.setting.yzf_open === "1" &&
    counter.setting.yzf_wechat_open === "1"
  )
    availableMethods.push("yzf_wechat");
  if (
    counter.setting.yzf_open === "1" &&
    counter.setting.yzf_alipay_open === "1"
  )
    availableMethods.push("yzf_alipay");
  if (counter.setting.airwallex_open === "1")
    availableMethods.push("airwallex_card"); // Default to card for Airwallex
  if (counter.setting.crypto_open === "1") availableMethods.push("crypto");

  form.pay_type =
    availableMethods.length > 0 ? availableMethods[0] : "airwallex_card"; // Fallback to a valid Airwallex method
  console.log(`Default pay_type set to: ${form.pay_type}`);
};

const route = useRoute();
const router = useRouter();
watch(
  () => route.query.payment,
  (newVal) => {
    if (newVal === "success") {
      Message.success("Payment successful!");
      refreshUserInfo();
      emit("payment-success");
      dialogFormVisible.value = false;
    } else if (newVal === "failed") {
      Message.error("Payment failed. Please try again.");
    } else if (newVal === "error") {
      Message.error("An error occurred during payment processing.");
    }
    router.replace({ query: { ...route.query, payment: null, balance: null } });
  }
);

onMounted(async () => {
  await initializeAirwallex();
  fetchSettings();
  get_limit_bag();
});

onUnmounted(() => {
  cleanupAirwallex();
  if (time_check_status.value) clearInterval(time_check_status.value);
});

const initializeAirwallex = async () => {
  if (counter.setting?.airwallex_open !== "1") return;
  if (!airwallex) {
    console.error("Airwallex not available from plugin");
    Message.error("Airwallex payment unavailable");
    return;
  }
  try {
    await airwallex.init({
      env: "demo", // Use "prod" for production
      origin: window.location.origin,
    });
    console.log("Airwallex initialized successfully with env: demo");
  } catch (error) {
    console.error("Airwallex initialization failed:", error);
    Message.error("Failed to initialize Airwallex: " + error.message);
    throw error; // Ensure the error propagates
  }
};
const cleanupAirwallex = () => {
  if (airwallexElement.value && airwallex) {
    try {
      airwallexElement.value.unmount();
      // Note: destroyElement is not a standard Airwallex method; remove if it causes errors
    } catch (error) {
      console.warn("Airwallex cleanup error:", error);
    }
    airwallexElement.value = null;
  }
};

const handleAirwallexPayment = async (intentData: any) => {
  if (!airwallex) {
    console.error("Airwallex not initialized");
    Message.error("Airwallex payment unavailable");
    return;
  }

  try {
    cleanupAirwallex();

    const containerId =
      activeName.value === "first"
        ? "airwallex-payment-element-first"
        : "airwallex-payment-element-second";
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container ${containerId} not found`);
    }

    const { type, paymentMethod } = getAirwallexElementType(form.pay_type);
    const elementConfig = {
      intent: {
        id: intentData.payment_intent_id,
        client_secret: intentData.client_secret,
      },
      currency: "HKD",
      autoCapture: true,
    };
    if (type !== "qrCode" && paymentMethod) {
      elementConfig.payment_method = paymentMethod;
    }

    airwallexElement.value = airwallex.createElement(type, elementConfig);
    if (
      !airwallexElement.value ||
      typeof airwallexElement.value.mount !== "function"
    ) {
      console.warn(`Falling back to redirect for ${form.pay_type}`);
      airwallex.redirectToCheckout({
        env: "demo",
        intent_id: intentData.payment_intent_id,
        client_secret: intentData.client_secret,
        currency: "HKD",
        locale: "zh-CN",
      });
      return;
    }

    airwallexElement.value.mount(containerId);
    // Event handlers...
  } catch (error) {
    console.error("Airwallex setup error:", error);
    Message.error("Payment setup failed: " + error.message);
    throw error;
  }
};

const processPayment = async (
  paymentMethod: Function,
  mobileCheck: boolean
) => {
  const isMobile = /Mobile|Android|iOS/.test(navigator.userAgent);
  const res = await paymentMethod();
  if (mobileCheck && isMobile) {
    window.location.href = res._rawValue.pay_url;
  } else {
    startPaymentStatusCheck(res._rawValue.order_id, res._rawValue.qr_code);
  }
};

const startPaymentStatusCheck = (orderId: string, qrCode: string) => {
  start.value = true;
  pay_now_type.value = "paying";
  pay_scan.value = qrCode;
  qr_show.value = true;

  time_check_status.value = setInterval(async () => {
    try {
      const statusRes = await check_order_status({ order_id: orderId });
      if (statusRes._rawValue.status === 200) {
        clearInterval(time_check_status.value);
        pay_now_type.value = "success";
        Message.success("支付成功！余额已更新");
        handlePaymentSuccess();
      } else if (statusRes._rawValue.status === "failed") {
        clearInterval(time_check_status.value);
        pay_now_type.value = "time_out";
        Message.error("支付失败");
      }
    } catch (error) {
      clearInterval(time_check_status.value);
      pay_now_type.value = "time_out";
      Message.error("支付状态检查失败");
    }
  }, 5000);
};

const handlePaymentSuccess = () => {
  pay_now_type.value = "success";
  Message.success("支付成功");
  start.value = false;
  refreshUserInfo();
  dialogFormVisible.value = false;
  emit("payment-success");
};

const send_charge = async () => {
  if (form.amount <= 0) {
    Message.error("请输入有效的充值金额");
    return;
  }

  charge_loading.value = true;
  qr_load.value = false;
  qr_show.value = false;
  showAirwallexForm.value = false;

  try {
    if (isAirwallexMethod(form.pay_type)) {
      console.log(`Initiating Airwallex payment for ${form.pay_type}`);
      const res = await airwallexPay({
        amount: form.amount,
        type: "charge",
        payment_method: form.pay_type,
      });
      console.log("Airwallex payment intent received:", res._rawValue);

      showAirwallexForm.value = true; // Show the container
      await nextTick(); // Wait for DOM update
      await handleAirwallexPayment(res._rawValue); // Mount the element
    } else {
      // Handle non Airwallex payment methods (e.g., crypto, balance)
      switch (form.pay_type) {
        case "crypto":
          qr_load.value = true;
          qr_show.value = true;
          const cryptoRes = await cryptomusPay({
            amount: form.amount,
            type: "charge",
            pay_type: form.pay_type,
          });
          window.open(cryptoRes._rawValue.qr_code, "_blank");
          dialogFormVisible.value = false;
          break;
        case "balance":
          break;
        default:
          Message.error("未选择的支付方式");
          break;
      }
    }
  } catch (error) {
    console.error("Payment error:", error);
    Message.error(`支付失败: ${error.message}`);
  } finally {
    charge_loading.value = false;
    qr_load.value = false;
  }
};

const up_to_vip = async () => {
  if (!vip_ids.value) {
    Message.error("请选择VIP套餐");
    return;
  }

  charge_loading.value = true;
  qr_load.value = false;
  qr_show.value = false;
  showAirwallexForm.value = false;

  try {
    if (isAirwallexMethod(form.pay_type)) {
      console.log(`Initiating Airwallex VIP payment for ${form.pay_type}`);
      const res = await airwallexPay({
        v_id: vip_ids.value,
        amount: vip_now_money.value,
        type: "vip",
        coupon: form.kami,
        payment_method: form.pay_type,
      });
      console.log("Airwallex payment intent received:", res._rawValue);

      showAirwallexForm.value = true; // Show the container
      await nextTick(); // Wait for DOM update
      await handleAirwallexPayment(res._rawValue); // Mount the element
    } else {
      // Handle non Airwallex payment methods
      switch (form.pay_type) {
        case "crypto":
          qr_load.value = true;
          const cryptoRes = await cryptomusPay({
            v_id: vip_ids.value,
            amount: vip_now_money.value,
            type: "vip",
            coupon: form.kami,
          });
          startPaymentStatusCheck(
            cryptoRes._rawValue.order_id,
            cryptoRes._rawValue.qr_code
          );
          break;
        case "balance":
          break;
        default:
          Message.error("未选择的支付方式");
          break;
      }
    }
  } catch (error) {
    console.error("VIP payment error:", error);
    Message.error(`支付失败: ${error.message}`);
  } finally {
    charge_loading.value = false;
    qr_load.value = false;
  }
};

// const up_to_vip = async () => {
//   if (!vip_ids.value) {
//     Message.error("请选择VIP套餐");
//     return;
//   }

//   charge_loading.value = true;
//   qr_load.value = false;
//   qr_show.value = false;
//   showAirwallexForm.value = false;

//   try {
//     if (isAirwallexMethod(form.pay_type)) {
//       console.log(`Initiating Airwallex VIP payment for ${form.pay_type}`);
//       const res = await airwallexPay({
//         v_id: vip_ids.value,
//         amount: vip_now_money.value,
//         type: "vip",
//         coupon: form.kami,
//         payment_method: form.pay_type,
//       });
//       console.log("Airwallex payment intent received:", res._rawValue);

//       showAirwallexForm.value = true;
//       await nextTick();
//       await handleAirwallexPayment(res._rawValue);
//     } else {
//       switch (form.pay_type) {
//         case "crypto":
//           qr_load.value = true;
//           const cryptoRes = await cryptomusPay({
//             v_id: vip_ids.value,
//             amount: vip_now_money.value,
//             type: "vip",
//             coupon: form.kami,
//           });
//           startPaymentStatusCheck(
//             cryptoRes._rawValue.order_id,
//             cryptoRes._rawValue.qr_code
//           );
//           break;
//         case "balance":
//           break;
//         default:
//           Message.error("未选择的支付方式");
//           break;
//       }
//     }
//   } catch (error) {
//     console.error("VIP payment error:", error);
//     Message.error(`支付失败: ${error.message}`);
//   } finally {
//     charge_loading.value = false;
//     qr_load.value = false;
//   }
// };

const fetchSettings = async () => {
  try {
    const res = await get_nav_config();
    counter.setting = res._rawValue.data;
    await get_vip();
    setDefaultPayType();
  } catch (error) {
    Message.error("获取设置失败");
  }
};

const get_vip = async () => {
  try {
    const res = await get_vip_show();
    vip_list.value = res._rawValue.data;
    vip_ids.value = res._rawValue.data[0]?.id;
    vip_now_money.value = res._rawValue.data[0]?.pay_amount || 0;
  } catch (error) {
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

const check_vip_type = (type: string) => {
  const types: Record<string, string> = {
    free: "免费版",
    day: "每日",
    month: "每月",
    total: "有效期内",
  };
  return types[type] || "免费版";
};

const changeRadio = (e: string) => {
  const selected = vip_list.value.find((item) => item.id === e);
  if (selected) {
    vip_ids.value = selected.id;
    vip_now_money.value = selected.pay_amount;
  }
};

const is_vipor_charge = () => {
  if (!form.pay_type) {
    Message.error("请选择支付方式");
    return;
  }
  if (activeName.value === "first") send_charge();
  else if (activeName.value === "second") up_to_vip();
  else buy_limit_bag();
};

const buy_limit_bag = async () => {
  try {
    charge_loading.value = true;
    const res = await buy_limit_bags({ id: form.limit_bag_id });
    Message.success(res._rawValue.message);
    dialogFormVisible.value = false;
    emit("payment-success");
  } catch (error) {
    console.error("购买次数包失败:", error);
  } finally {
    charge_loading.value = false;
  }
};

const dialogFormVisible = computed({
  get() {
    if (props.dialogFormVisible) fetchSettings();
    return props.dialogFormVisible;
  },
  set(val) {
    emit("handleCancels", val);
  },
});

const handleClick = (tab: any) => {
  activeName.value = tab;
  form.pay_type = "";
  setDefaultPayType();
};

const handleFinish = () => (pay_now_type.value = "time_out");

const dialogm = () => {
  dialogFormVisible.value = false;
  cleanupAirwallex();
};

const changeLimitRadio = (e: string) => (form.limit_bag_id = e);
</script>

<style scoped>
.airwallex-payment-container {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin: 20px 0;
  min-height: 150px;
}

.hidden {
  display: none;
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
</style>
