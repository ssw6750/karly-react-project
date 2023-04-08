import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import { useEffect, useRef } from 'react';

import Counter from '../Counter/Counter';
import { saveCartData } from '../../utils';
import { Button } from '../Button/Button';
import { modalBtnState } from '../../store/cartModalState';

import styles from './CartModal.module.scss';
import TotalPrice from './TotalPrice';
import EarnPointsMark from './EarnPointsMark';

import {
  selectedproductId,
  productListFamily,
} from '@/store/productListState.js';
import {
  productCartModalState,
  cartDataState,
} from '@/store/cartModalState.js';
import { darkFilterState } from '@/store/darkFilterState.js';
import { getPriceFormat } from '@/utils';
import TotalPrice from './TotalPrice';
import { Button } from '../Button/Button';
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import { useId } from 'react';
import { countState } from '@/store/CounterState.js';
import { useEffect } from 'react';
import EarnPointsMark from './EarnPointsMark';
import { saveCartData } from '../../utils';

function CartModal() {
  const productId = useRecoilValue(selectedproductId);
  const product = useRecoilValue(productListFamily(productId));
  const setIsVisible = useSetRecoilState(productCartModalState);
  const setDarkFilter = useSetRecoilState(darkFilterState);
  const [cartData, setCartData] = useRecoilState(cartDataState);

  const [count, setCount] = useRecoilState(countState);

  const handleCancelBtnClick = () => {
    setIsVisible(false);
    setDarkFilter(false);
    modalRef.current.ariaHidden = true;
    modalRef.current.ariaModal = false;
    modalBtn.focus();
  };

  const handleCartBtnClick = () => {
    saveCartData(product.id, count[product.id], cartData, setCartData);
    setIsVisible(false);
    setDarkFilter(false);
    console.log('cartData', cartData);
  };

  // Counter 초기화
  useEffect(() => {
    setCount({
      [product.id]: 1,
    });
  }, []);

  return (
    <div
      ref={modalRef}
      aria-atomic="true"
      aria-label={`${product.name}모달창이 열렸습니다.`}
      aria-live="assertive"
      aria-modal="true"
      className={styles.cartModal}
      role="dialog"
      onKeyDown={handleModalKeyEvent}
    >
      <div className={styles.info}>
        <span className={styles.title}>{product.name}</span>
        <span className={styles.priceLayout}>
          {product.saleRatio ? (
            <>
              <span className={styles.price}>
                {getPriceFormat(product.salePrice)}원
              </span>
              <span className={styles.sale}>
                {getPriceFormat(product.price)}원
              </span>
            </>
          ) : (
            <span className={styles.price}>
              {getPriceFormat(product.price)}원
            </span>
          )}
        </span>
        <span className={styles.couterLayout}>
          <Counter name={product.id} />
        </span>
      </div>
      <div className={styles.totalPrice}>
        <div className={styles.priceLayout1}>
          <span className={styles.total}>합계</span>
          {/* 최적화 진행시 수정해야할듯 */}
          {product.saleRatio ? (
            <TotalPrice name={product.id} price={product.salePrice} />
          ) : (
            <TotalPrice name={product.id} price={product.price} />
          )}
        </div>
        <div className={styles.priceLayout3}>
          <EarnPointsMark />
          <span className={styles.accumulate}>구매시 5원 적립</span>
        </div>
      </div>
      <div className={styles.buttonLayout}>
        <Button
          ref={closeBtnRef}
          type="button"
          uiType="fourth"
          onClick={handleCancelBtnClick}
        >
          취소
        </Button>
        <Button ref={containBtnRef} type="button" onClick={handleCartBtnClick}>
          장바구니 담기
        </Button>
      </div>
    </div>
  );
}

export default CartModal;
