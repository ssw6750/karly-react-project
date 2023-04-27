import { useLoaderData, useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';

import { ProductDetailPopUp } from '../../components/ProductDetailPopUp/ProductDetailPopUp';
import ProductDetailPopUpLayout from '../../components/ProductDetailPopUp/ProductDetailPopUpLayout';

import styles from './ProductDetail.module.scss';
import ProductInquiry from './Productinquiry/Productinquiry';
import ProductReview from './ProductReview/ProductReview';
import ProductThumbnail from './ProductThumbnail/ProductThumbnail';
import { productNameAtom } from './ProductReview/@recoil/renderState';

import { productListFamily } from '@/store/productListState.js';
import { useRef } from 'react';
import ProductInformation from './ProductInformation/ProductInformation';
import ProductDetailMenu from './ProductDetailMenu/ProductDetailMenu';
import DetailInformation from './DetailInformation/DetailInformation';
import useMoveScroll from './@hook/useMoveScroll';
import { useDetailCollection } from '../../firebase/firestore/useDetailCollection';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

function ProductDetail() {
  const { productId } = useParams();
  const product = useRecoilValue(productListFamily(productId));

  const [productName, setProductName] = useRecoilState(productNameAtom);

  const detailsRef = useRef();

  useDocumentTitle(productName + ' - Karly');

  //후기 개수 navigation바에 업데이트
  const [count, setCount] = useState(0);
  const { dataState } = useDetailCollection('reviewData');
  const [countText, setCountText] = useState('');

  useEffect(() => {
    if (dataState) {
      setCount(dataState.length);
    }
    let text = `후기(${count})`;

    setCountText(text);
  }, [dataState, count]);

  // https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/from

  const navigations = [
    useMoveScroll('상품정보'),
    useMoveScroll('상세정보'),
    useMoveScroll(countText),
    useMoveScroll('문의'),
  ];

  // 페이지 전환 시, product.name 정보 얻어오기
  useEffect(() => {
    setProductName(product.name);
  }, []);

  // 스크롤 이벤트
  const [position, setPosition] = useState();

  const getElementPosition = (e) => {
    const productInfo = navigations[0].element.current;
    const detailInfo = navigations[1].element.current;
    const review = navigations[2].element.current;
    const inquiry = navigations[3].element.current;

    const scrollY = window.scrollY; // 스크롤 양

    if (scrollY > inquiry.offsetTop - 10) {
      setPosition('inquiry');
    } else if (
      scrollY <= inquiry.offsetTop - 10 &&
      scrollY > review.offsetTop - 10
    ) {
      setPosition('review');
    } else if (
      scrollY <= review.offsetTop - 10 &&
      scrollY > detailInfo.offsetTop - 10
    ) {
      setPosition('detailInfo');
    } else if (
      scrollY <= detailInfo.offsetTop - 10 &&
      scrollY > productInfo.offsetTop - 10
    ) {
      setPosition('productInfo');
    } else {
      setPosition(null);
    }
  };

  // 클린업을 넣어야 하는가요? 넣으면 Cannot read properties of null (reading 'removeEventListener') 에라 발생합니다
  useEffect(() => {
    detailsRef.current.addEventListener('scroll', getElementPosition); // 스크롤시 getBannerPosition 발생

    // return () =>
    //   detailsRef.current.removeEventListener('scroll', getElementPosition); // 클린업, 페이지를 나가면 이벤트 삭제
  }, [detailsRef]);

  const navigationParts = [
    <ProductInformation key={0} product={product} />,
    <DetailInformation key={1} product={product} />,
    <ProductReview key={2} />,
    <ProductInquiry key={3} />,
  ];

  const navigationPartRefs = navigationParts.map((part, index) => (
    <div
      ref={navigations[index].element}
      key={index}
      className={styles.naviLayout}
      onScroll={(e) => {
        console.log(`${index}번 스크롤: `, e.target.scrollTop);
      }}
    >
      {part}
    </div>
  ));

  return (
    <div className={styles.ProductDetailWrapper} ref={detailsRef}>
      <ProductThumbnail product={product} />
      <ProductDetailMenu navigations={navigations} position={position} />
      {navigationPartRefs}
      <ProductDetailPopUpLayout />
    </div>
  );
}

export default ProductDetail;

// GET (READ)
// export async function loader({ params }) {
//   console.log('zzz');
//   console.log(params.productId);
//   console.log(typeof params.productId);
//   const product = await useRecoilValue(productListFamily(params.productId));

//   console.log(product);

//   return product;
// }
