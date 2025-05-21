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
          <!-- Added Submit Button for Airwallex Card -->
          <div class="payment-actions">
            <button
              v-if="form.pay_type === 'airwallex_card' && showAirwallexForm"
              @click="confirmAirwallexPayment"
              :disabled="!isAirwallexReady || confirmLoading"
              class="pay-button"
            >
              Pay with Airwallex
            </button>
          </div>
          <!-- Debug Info -->
          <div v-if="isAirwallexMethod(form.pay_type) && !showAirwallexForm">
            <p class="text-red-500">
              Airwallex form not shown. Please click "立即充值" to proceed.
            </p>
          </div>
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
          <!-- Added Submit Button for Airwallex Card -->

          <div class="payment-actions">
            <button
              v-if="form.pay_type === 'airwallex_card' && showAirwallexForm"
              @click="confirmAirwallexPayment"
              :disabled="!isAirwallexReady || confirmLoading"
              class="pay-button"
            >
              Pay with Airwallex
            </button>
          </div>
          <!-- Debug Info -->
          <div v-if="isAirwallexMethod(form.pay_type) && !showAirwallexForm">
            <p class="text-red-500">
              Airwallex form not shown. Please click "立即充值" to proceed.
            </p>
          </div>
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
import { nextTick, ref, onMounted, onUnmounted, computed, watch } from "vue";
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
  redirectToCheckout: (config: {
    env: string;
    intent_id: string;
    client_secret: string;
    currency: string;
    locale?: string;
  }) => void;
}

const airwallex = $airwallex as AirwallexInstance | null;
import { useRoute, useRouter } from "vue-router";
import { reactive } from "vue";
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
  yzf_pay,
  buy_vip,
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
const airwallexIntent = ref<any>(null);
const confirmLoading = ref(false);
const isAirwallexInitialized = ref(false);

const airwallexPaymentTypes = [
  "airwallex_card",
  "Alipay",
  "AlipayHK",
  "WeChat Pay",
  "WeChat PayHK",
  "airwallex_paypal",
];

const getAirwallexElementType = (
  payType: string
): { type: string; paymentMethod?: string } => {
  switch (payType) {
    case "airwallex_card":
      return { type: "card" };
    case "Alipay":
    case "AlipayHK":
    case "WeChat Pay":
    case "WeChat PayHK":
      return { type: "qrCode" };
    case "airwallex_paypal":
      return { type: "dropin", paymentMethod: "paypal" };
    default:
      return { type: "dropin" };
  }
};

const isAirwallexMethod = (payType: string) =>
  airwallexPaymentTypes.includes(payType);

const isAirwallexReady = computed(() => {
  const ready =
    isAirwallexInitialized.value &&
    airwallexElement.value &&
    airwallexIntent.value &&
    airwallexIntent.value.payment_intent_id &&
    airwallexIntent.value.client_secret;
  console.log("isAirwallexReady:", ready, {
    isAirwallexInitialized: isAirwallexInitialized.value,
    airwallexElement: airwallexElement.value,
    airwallexIntent: airwallexIntent.value,
    payment_intent_id: airwallexIntent.value?.payment_intent_id,
    client_secret: airwallexIntent.value?.client_secret,
  });
  return ready;
});

const form = reactive({
  amount: counter.setting.min_recharge
    ? parseFloat(counter.setting.min_recharge)
    : 1,
  pay_type: "",
  vip_type: 1,
  kami: "",
  limit_bag_id: "",
});

watch(
  () => form.pay_type,
  (newVal, oldVal) => {
    console.log("Pay type changed from:", oldVal, "to:", newVal);
    const wasAirwallex = isAirwallexMethod(oldVal);
    const isNowAirwallex = isAirwallexMethod(newVal);
    if (wasAirwallex && !isNowAirwallex && !showAirwallexForm.value) {
      cleanupAirwallex();
    } else if (!wasAirwallex && isNowAirwallex) {
      console.log(
        "Switched to Airwallex method, awaiting user to click 立即充值"
      );
    }
  }
);

const refreshUserInfo = async () => {
  try {
    const response = await get_user();
    console.log("User info refreshed:", response._rawValue.data);
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
    availableMethods.push("airwallex_card");
  if (counter.setting.crypto_open === "1") availableMethods.push("crypto");
  form.pay_type =
    availableMethods.length > 0 ? availableMethods[0] : "airwallex_card";
  console.log("Default pay type set to:", form.pay_type);
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
    } else if (newVal === "failed")
      Message.error("Payment failed. Please try again.");
    else if (newVal === "error")
      Message.error("An error occurred during payment processing.");
    router.replace({ query: { ...route.query, payment: null, balance: null } });
  }
);

const initializeComponent = async () => {
  await initializeAirwallex();
  await fetchSettings();
  await get_limit_bag();
};

onMounted(() => {
  initializeComponent();
});

onUnmounted(() => {
  if (!showAirwallexForm.value) cleanupAirwallex();
  if (time_check_status.value) clearInterval(time_check_status.value);
});

const initializeAirwallex = async () => {
  if (counter.setting?.airwallex_open !== "1") {
    console.log("Airwallex is disabled in settings");
    return;
  }
  if (!airwallex) {
    console.error("Airwallex SDK is not available");
    Message.error(
      "Airwallex payment is unavailable due to SDK loading failure"
    );
    return;
  }
  try {
    await airwallex.init({ env: "demo", origin: window.location.origin });
    isAirwallexInitialized.value = true;
    console.log("Airwallex initialized successfully with env: demo");
  } catch (error) {
    console.error("Airwallex initialization failed:", error);
    Message.error("Failed to initialize Airwallex: " + error.message);
    isAirwallexInitialized.value = false;
  }
};

const cleanupAirwallex = () => {
  if (airwallexElement.value && airwallex) {
    try {
      airwallexElement.value.unmount();
      console.log("Airwallex element unmounted");
    } catch (error) {
      console.warn("Airwallex cleanup error:", error);
    }
    airwallexElement.value = null;
  }
  airwallexIntent.value = null;
  showAirwallexForm.value = false;
  console.log("Airwallex state cleaned up");
};

const handleAirwallexPayment = async (intentData: any) => {
  if (
    !airwallex ||
    !intentData ||
    !intentData.payment_intent_id ||
    !intentData.client_secret
  ) {
    console.error("Invalid payment intent data:", intentData);
    Message.error("Invalid payment intent data");
    showAirwallexForm.value = false;
    return;
  }
  try {
    const containerId =
      activeName.value === "first"
        ? "airwallex-payment-element-first"
        : "airwallex-payment-element-second";
    const container = document.getElementById(containerId);
    if (!container) throw new Error(`Container ${containerId} not found`);
    const { type, paymentMethod } = getAirwallexElementType(form.pay_type);
    const elementConfig = {
      intent: {
        id: intentData.payment_intent_id,
        client_secret: intentData.client_secret,
      },
      currency: "HKD",
      autoCapture: true,
      // Enable 3DS
      payment_method_options: {
        card: {
          three_ds: {
            enabled: true,
          },
        },
      },
    };
    if (type !== "qrCode" && paymentMethod)
      elementConfig.paymentMethod = paymentMethod;
    airwallexElement.value = airwallex.createElement(type, elementConfig);
    if (
      !airwallexElement.value ||
      typeof airwallexElement.value.mount !== "function"
    ) {
      console.log("Falling back to Airwallex redirectToCheckout");
      airwallex.redirectToCheckout({
        env: "demo",
        intent_id: intentData.payment_intent_id,
        client_secret: intentData.client_secret,
        currency: "HKD",
        locale: "zh-CN",
      });
      return;
    }
    // Add event listeners for Airwallex element
    airwallexElement.value.on("ready", () => {
      console.log("Airwallex element is ready");
    });
    airwallexElement.value.on("success", (event: any) => {
      console.log("Airwallex payment succeeded:", event.detail);
      // If 3DS is required, this event will fire after completion
      handlePaymentSuccess();
      confirmLoading.value = false; // Reset loading state
    });
    airwallexElement.value.on("error", (event: any) => {
      console.error("Airwallex element error:", event.detail);
      Message.error(
        "Payment error: " + (event.detail.message || "Unknown error")
      );
      showAirwallexForm.value = false;
      confirmLoading.value = false; // Reset loading state
    });
    airwallexElement.value.on("paymentIntentStatusChanged", (event: any) => {
      console.log("Payment intent status changed:", event.detail);
      // Handle state changes (e.g., requires_action for 3DS)
      if (event.detail.status === "requires_action") {
        console.log("3DS authentication required");
        // The SDK will automatically handle 3DS; wait for 'success' or 'error' event
      }
    });
    airwallexElement.value.mount(containerId);
    showAirwallexForm.value = true;
    console.log("Airwallex element mounted successfully");
  } catch (error) {
    console.error("Airwallex setup error:", error);
    Message.error("Payment setup failed: " + error.message);
    showAirwallexForm.value = false;
  }
};

const confirmAirwallexPayment = async () => {
  if (!airwallex || !isAirwallexReady.value) {
    console.error("Airwallex payment not ready:", {
      airwallex,
      isAirwallexReady: isAirwallexReady.value,
    });
    Message.error("Airwallex payment is not ready. Please try again.");
    return;
  }

  confirmLoading.value = true;
  try {
    const result = await airwallex.confirmPaymentIntent({
      element: airwallexElement.value,
      id: airwallexIntent.value.payment_intent_id,
      client_secret: airwallexIntent.value.client_secret,
      payment_method_options: {
        card: {
          auto_capture: true,
          three_ds: {
            enabled: true,
          },
        },
      },
    });
    console.log("Airwallex confirm result:", result);
    if (result.status === "SUCCEEDED") {
      Message.success("Payment successful!");
      handlePaymentSuccess();
      // Reset Airwallex state to prevent re-confirmation
      cleanupAirwallex();
    } else if (result.status === "requires_action") {
      console.log("3DS authentication in progress, awaiting completion");
      // SDK handles 3DS; rely on element's 'success' or 'error' events
    } else {
      Message.error("Payment failed: " + (result.message || "Unknown status"));
      confirmLoading.value = false;
    }
  } catch (error) {
    console.error(
      "Airwallex payment confirmation error:",
      JSON.stringify(error, null, 2)
    );
    if (error.code === "invalid_status_for_operation") {
      Message.error(
        "Payment has already been processed or is in an invalid state. Please start a new payment."
      );
      // Reset Airwallex state to allow a new payment
      cleanupAirwallex();
    } else if (error.code === "invalid_request_error") {
      Message.error("Invalid card details. Please check and try again.");
    } else {
      Message.error("Payment failed: " + (error.message || "Unknown error"));
    }
    confirmLoading.value = false;
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
  const isMobile = /Mobile|Android|iOS/.test(navigator.userAgent);

  try {
    switch (form.pay_type) {
      case "alipay":
        const alipayRes = await alipay({
          amount: form.amount,
          type: "charge",
          is_mobile: isMobile && counter.setting.alipay_wap_open == "1" ? 1 : 0,
        });
        if (isMobile && counter.setting.alipay_wap_open == "1") {
          window.location.href = alipayRes._rawValue.pay_url;
        } else {
          startPaymentStatusCheck(
            alipayRes._rawValue.order_id,
            alipayRes._rawValue.qr_code
          );
        }
        break;
      case "wechat":
        const wechatRes = await wechat({
          amount: form.amount,
          type: "charge",
          is_mobile: isMobile && counter.setting.wechat_wap_open == "1" ? 1 : 0,
        });
        if (isMobile && counter.setting.wechat_wap_open == "1") {
          window.location.href = wechatRes._rawValue.pay_url;
        } else {
          startPaymentStatusCheck(
            wechatRes._rawValue.order_id,
            wechatRes._rawValue.qr_code
          );
        }
        break;
      case "yzf_alipay":
        const yzfAlipayRes = await yzf_pay({
          amount: form.amount,
          type: "charge",
          pay_type: "alipay",
        });
        const formDiv = document.createElement("div");
        formDiv.innerHTML = yzfAlipayRes._rawValue.data;
        document.body.appendChild(formDiv);
        document.getElementById("dopay")?.submit();
        break;
      case "yzf_wechat":
        const yzfWechatRes = await yzf_pay({
          amount: form.amount,
          type: "charge",
          pay_type: "wxpay",
        });
        const formDiv2 = document.createElement("div");
        formDiv2.innerHTML = yzfWechatRes._rawValue.data;
        document.body.appendChild(formDiv2);
        document.getElementById("dopay")?.submit();
        break;
      case "crypto":
        qr_load.value = true;
        qr_show.value = true;
        const cryptoRes = await cryptomusPay({
          amount: form.amount,
          type: "charge",
          pay_type: form.pay_type,
          currency: "HKD",
        });
        window.open(cryptoRes._rawValue.qr_code, "_blank");
        dialogFormVisible.value = false;
        break;
      default:
        if (isAirwallexMethod(form.pay_type)) {
          console.log("Initiating Airwallex payment with:", {
            amount: form.amount,
            type: "charge",
            payment_method: form.pay_type,
            currency: "HKD",
          });

          const res = await airwallexPay({
            amount: form.amount,
            type: "charge",
            payment_method: form.pay_type,
            currency: "HKD",
          });
          console.log("airwallexPay response:", res._rawValue);
          if (
            res._rawValue &&
            res._rawValue.payment_intent_id &&
            res._rawValue.client_secret
          ) {
            airwallexIntent.value = res._rawValue;
            showAirwallexForm.value = true;
            await nextTick();
            await handleAirwallexPayment(res._rawValue);
          } else {
            console.error("Invalid airwallexPay response:", res._rawValue);
            Message.error("Failed to retrieve payment intent data");
            showAirwallexForm.value = false;
          }
        } else {
          Message.error("未支持的支付方式");
        }
        break;
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
  const isMobile = /Mobile|Android|iOS/.test(navigator.userAgent);

  try {
    switch (form.pay_type) {
      case "alipay":
        const alipayRes = await alipay({
          v_id: vip_ids.value,
          amount: vip_now_money.value,
          type: "vip",
          coupon: form.kami,
          is_mobile: isMobile && counter.setting.alipay_wap_open == "1" ? 1 : 0,
        });
        if (isMobile && counter.setting.alipay_wap_open == "1") {
          window.location.href = alipayRes._rawValue.pay_url;
        } else {
          startPaymentStatusCheck(
            alipayRes._rawValue.order_id,
            alipayRes._rawValue.qr_code
          );
        }
        break;
      case "wechat":
        const wechatRes = await wechat({
          v_id: vip_ids.value,
          amount: vip_now_money.value,
          type: "vip",
          coupon: form.kami,
          is_mobile: isMobile && counter.setting.wechat_wap_open == "1" ? 1 : 0,
        });
        if (isMobile && counter.setting.wechat_wap_open == "1") {
          window.location.href = wechatRes._rawValue.pay_url;
        } else {
          startPaymentStatusCheck(
            wechatRes._rawValue.order_id,
            wechatRes._rawValue.qr_code
          );
        }
        break;
      case "yzf_alipay":
        const yzfAlipayRes = await yzf_pay({
          v_id: vip_ids.value,
          amount: vip_now_money.value,
          type: "vip",
          coupon: form.kami,
          pay_type: "alipay",
        });
        const formDiv = document.createElement("div");
        formDiv.innerHTML = yzfAlipayRes._rawValue.data;
        document.body.appendChild(formDiv);
        document.getElementById("dopay")?.submit();
        break;
      case "yzf_wechat":
        const yzfWechatRes = await yzf_pay({
          v_id: vip_ids.value,
          amount: vip_now_money.value,
          type: "vip",
          coupon: form.kami,
          pay_type: "wxpay",
        });
        const formDiv2 = document.createElement("div");
        formDiv2.innerHTML = yzfWechatRes._rawValue.data;
        document.body.appendChild(formDiv2);
        document.getElementById("dopay")?.submit();
        break;
      case "balance":
        await buy_vip({ v_id: vip_ids.value, coupon: form.kami });
        Message.success("VIP购买成功");
        handlePaymentSuccess();
        break;
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
      default:
        if (isAirwallexMethod(form.pay_type)) {
          console.log("Initiating Airwallex payment for VIP with:", {
            v_id: vip_ids.value,
            amount: vip_now_money.value,
            type: "vip",
            coupon: form.kami,
            payment_method: form.pay_type,
          });
          const res = await airwallexPay({
            v_id: vip_ids.value,
            amount: vip_now_money.value,
            type: "vip",
            coupon: form.kami,
            payment_method: form.pay_type,
          });
          console.log("airwallexPay response:", res._rawValue);
          if (
            res._rawValue &&
            res._rawValue.payment_intent_id &&
            res._rawValue.client_secret
          ) {
            airwallexIntent.value = res._rawValue;
            showAirwallexForm.value = true;
            await nextTick();
            await handleAirwallexPayment(res._rawValue);
          } else {
            console.error("Invalid airwallexPay response:", res._rawValue);
            Message.error("Failed to retrieve payment intent data");
            showAirwallexForm.value = false;
          }
        } else {
          Message.error("未支持的支付方式");
        }
        break;
    }
  } catch (error) {
    console.error("VIP payment error:", error);
    Message.error(`支付失败: ${error.message}`);
  } finally {
    charge_loading.value = false;
    qr_load.value = false;
  }
};

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
  console.log("is_vipor_charge called with:", {
    activeName: activeName.value,
    pay_type: form.pay_type,
  });
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
  if (!showAirwallexForm.value) cleanupAirwallex();
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
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 15px; /* Space between card fields and button */
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

.payment-actions {
  margin-top: auto; /* Pushes the button to the bottom of the container */
  padding-top: 10px;
}

.pay-button {
  width: 100%; /* Full width of the container for a modern look */
  padding: 12px 24px; /* Increased padding for a larger button */
  background-color: #1890ff; /* Consistent with your design */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px; /* Larger text for readability */
  font-weight: 500;
  transition: background-color 0.3s ease; /* Smooth hover effect */
}

.pay-button:hover:not(:disabled) {
  background-color: #40a9ff; /* Lighter shade on hover */
}

.pay-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.6; /* Subtle disabled state */
}
</style>
