import axios from "axios";
import { showAlert } from "./alert";
const stripe = Stripe(
  "pk_test_51JR4qEIi6kT4KaNDm9Mq9n4HrsRJsmMCT6klP0vQDDBY53oh1jU622PhtXlVCYcCLp0LRPZHaDFKVHP2w7Cerf1q000lUlorp6"
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios.get(
      `/api/v1/booking/checkout-session/${tourId}`
    );

    if (session.status === 200) {
      showAlert("success", "checkout session created!");
    }
    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.checkOutSession.id,
    });
  } catch (err) {
    console.log(err);
    showAlert("error", err);
  }
};
