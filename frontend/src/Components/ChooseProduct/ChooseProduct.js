import styles from '~/Components/ChooseProduct/ChooseProduct.module.scss';
import classNames from 'classnames/bind';
import Title from '~/Components/Title/Title';
import parrot1 from '~/Assets/image/SelectProduct/pngegg.png';
// import parrot2 from '~/Assets/image/SelectProduct/Grey-Parrot-PNG-Free-Download.png';
import nest from '~/Assets/image/SelectProduct/nestreal.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Tooltip } from '@chakra-ui/react';

const cx = classNames.bind(styles);

function ChooseProduct() {
    return (
        <div className={cx('wrapper')}>
            <Title>Parrots</Title>
            <div className="container">
                <div className={cx('product-hover-effect-container')}>
                    <Tooltip label="Shopping time!!!" placement="right" fontSize="xl">
                        <Link className={cx('item')} to="/parrot-product">
                            <img className={cx('parrot-img')} src={parrot1} />
                        </Link>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
}

export default ChooseProduct;
