import { useState } from 'react';
import { useRecoilValue, useRecoilState, useSetRecoilValue } from 'recoil';

import styles from './ProductList.module.css';

import { FilterList } from './FilterList';
import { Pagination } from './Pagination';

import ProductCard from '@/components/ProductCard/ProductCard';

import {
  renderAllFilterListSelector,
  renderKarlyOnlySelector,
  limitAtom,
  offsetSelector,
} from '@/pages/ProductList/@recoil/renderState';

import { categoryListSelectorFamily } from '@/pages/ProductList/@recoil/checkState.js';

import {
  SortLowerPriceButton,
  SortUpperPriceButton,
  DummyButtons,
} from './SortButton';

import CartModalLayout from './../../components/CartModal/CartModalLayout';

const ProductCards = () => {
  const renderAllFilterList = useRecoilValue(renderAllFilterListSelector);
  const limit = useRecoilValue(limitAtom);
  const offset = useRecoilValue(offsetSelector);

  return (
    <>
      {renderAllFilterList
        .slice(offset, offset + limit)
        .map((product, index) => {
          return (
            // eslint-disable-next-line react/jsx-key
            <div key={`product-${index}`} style={{ marginBottom: '100px' }}>
              <ProductCard product={product} />
            </div>
          );
        })}
    </>
  );
};

const 뭐가있는지확인후랜더링해주는함수 = () => {
  const renderAllFilterList = useRecoilValue(renderAllFilterListSelector);
  const 뭐가있다 = renderAllFilterList.length > 0;

  if (뭐가있다) {
    return <ProductCards />;
  }

  return <div>상품이없어용</div>;
};

export const ProductList = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.innerContainer}>
          <div className={styles.productListTitle}>베스트</div>
          <section className={styles.product}>
            <FilterList />
            <div className={styles.productCardsWrapper}>
              <div className={styles.sortButtonContainer}>
                <DummyButtons text={'신상품순'} />
                <DummyButtons text={'판매량순'} />
                <DummyButtons text={'혜택순'} />
                <SortLowerPriceButton />
                <SortUpperPriceButton />
              </div>
              <뭐가있는지확인후랜더링해주는함수 />
            </div>
          </section>
          <Pagination />
        </div>
      </div>
      <CartModalLayout />
    </>
  );
};
export default ProductList;

/* ----------------------- 만들다가 공용에게 밀린 나의 작고 소중한 컴포넌트들.. ----------------------- */

// export const CategoryContainer = ({ index, title, productEx, count }) => {
//   const [isActive, setIsActive] = useState(false);

//   const handleBtn = (e) => {
//     e.preventDefault;
//     isActive ? setIsActive(false) : setIsActive(true);
//   };

//   return (
//     <div className={styles.navMenuCategory}>
//       <CategoryList controlId={index} handler={handleBtn} isActive={isActive}>
//         <span>{title}</span>
//       </CategoryList>
//       <NavMenu
//         controlId={index}
//         productEx={productEx}
//         isActive={isActive}
//         count={count}
//       />
//     </div>
//   );
// };

// export const CategoryList = ({ controlId, handler, isActive, children }) => {
//   return (
//     <button
//       id={`${controlId}-handle`}
//       className={styles.navMenuBtn}
//       // isActive={isActive}
//       onClick={handler}
//     >
//       {children}
//       {isActive ? (
//         <div alt="화살표" className={styles.arrowUp} />
//       ) : (
//         <div alt="화살표" className={styles.arrowDown} />
//       )}
//     </button>
//   );
// };

// export const NavMenu = ({ controlId, productEx, isActive, count }) => {
//   return (
//     <ul
//       aria-labelledby={`${controlId}-handle`}
//       className={classNames(
//         styles.navMenuUl,
//         isActive ? styles.active : styles.inactive
//       )}
//     >
//       <li className={styles.navMenuUlList}>
//         <input
//           type="checkbox"
//           name="checkbox"
//           id="check-box"
//           value={productEx}
//         />
//         <label htmlFor="check-box">{productEx}</label>
//         <span className={styles.ulListCount}>{count}</span>
//       </li>
//     </ul>
//   );
// };

/* --------------------------------- test console --------------------------------- */
// console.log(productList)
//8
// console.log(limit)
//1
// console.log(page)
//0
// console.log(offset)
//  => 0~8번 array(배열) 리턴
// console.log(productList.slice(0, 7)
