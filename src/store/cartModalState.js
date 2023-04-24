import { atom /* selector */, selector } from 'recoil';
import { recoilPersist } from 'recoil-persist';

import { productListFamily } from './productListState';

import { countState } from '@/components/Counter/@recoil/counterState.js';

// 영속성
const { persistAtom } = recoilPersist({
  key: 'recoil-persist', // this key is using to store data in local storage
  storage: localStorage, // configurate which stroage will be used to store the data
});

// 장바구니 열기 닫기 상태
export const productCartModalState = atom({
  key: 'productCartModal',
  default: false,
});

// 접근성 - 포커싱이 다시 돌아오도록 상품카드의 장바구니 버튼의 ref를 저장
export const modalBtnState = atom({
  key: 'modalBtnState',
  default: null,
});

// 장바구니 데이터 저장 - 아이템과 개수를 배열 형태로 저장
export const cartDataState = atom({
  key: 'cartDataState',
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const cartProductsState = selector({
  key: 'cartProductsState',
  get: ({ get }) => {
    const cartData = get(cartDataState);

    const cartProducts = cartData.map((data) => {
      return get(productListFamily(data.productId));
    });

    return cartProducts;
  },
});

export const cartProductTypeState = selector({
  key: 'cartProductTypeState',
  get: ({ get }) => {
    const cartProducts = get(cartProductsState);

    const cartProductsType = [
      { storageType: 'cold', data: [] },
      { storageType: 'frozen', data: [] },
      {
        storageType: 'temperature',
        data: [],
      },
    ];

    cartProducts.map((product) => {
      cartProductsType.map((type) => {
        if (type.storageType === product.storageType) {
          type.data.push({ ...product, selected: true });
        }
      });
    });

    return cartProductsType;
  },
});

export const selectedState = atom({
  key: 'selectedState',
  default: {},
});

export const selectedAllState = atom({
  key: 'selectedAllState',
  default: true,
});

export const totalItemCountState = selector({
  key: 'totalItemCountState',
  get: ({ get }) => {
    return Object.keys(get(selectedState)).length;
  },
});

export const totalActiveItemCountState = selector({
  key: 'totalActiveItemCountState',
  get: ({ get }) => {
    let count = 0;

    Object.values(get(selectedState)).map((data) => {
      if (data) count += 1;
    });

    return count;
  },
});

export const cartPriceData = selector({
  key: 'cartPriceData',
  get: ({ get }) => {
    const count = get(countState);
    const select = get(selectedState);
    const setCartData = get(cartProductsState);

    let totalPrice = 0;
    let totalSalePrice = 0;
    let totalPaymentPrice = 0;

    setCartData.map((data) => {
      if (select[data.id]) {
        const dataCount = count[data.id];

        totalPrice += data.price * dataCount;
        totalPaymentPrice +=
          (data.saleRatio ? data.salePrice : data.price) * dataCount;
      }
    });

    totalSalePrice = totalPrice - totalPaymentPrice;

    return [totalPrice, totalSalePrice, totalPaymentPrice];
  },
});
