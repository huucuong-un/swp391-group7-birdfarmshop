import {
    Container,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Switch,
    Button,
    Textarea,
    Input,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Stack,
    Box,
    Text,
    Flex,
} from '@chakra-ui/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMinus,
    faPlus,
    faArrowsRotate,
    faAngleLeft,
    faAngleRight,
    faCirclePlus,
} from '@fortawesome/free-solid-svg-icons';

import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from '~/Pages/AdNestManagement/AdNestManagement.module.scss';
import FAQSAPI from '~/Api/FAQSAPI';
import NestAPI from '~/Api/NestAPI';
import ParrotSpeciesAPI from '~/Api/ParrotSpeciesAPI';
import UserAPI from '~/Api/UserAPI';
import { useNavigate } from 'react-router-dom';
import RoleAPI from '~/Api/RoleAPI';

const cx = classNames.bind(styles);

function AdNestPriceManagement() {
    const [faqsList, setFaqsList] = useState([]);
    const [nestPrice, setNestPrice] = useState([]);
    const [show, setShow] = useState(false);
    const [showForUpdate, setShowForUpdate] = useState(false);
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState(0);
    const [status, setStatus] = useState(false);
    const [addStatus, setAddStatus] = useState(false);
    const [addFail, setAddFail] = useState(1);
    const [submitStatus, setSubmitStatus] = useState();
    const [vinh, setVinh] = useState(true);
    const [combineData, setCombineData] = useState([]);
    const [species, setSpecies] = useState([]);
    const [sort, setSort] = useState({ page: 1, limit: 10, searchDate: null, status: null, sortPrice: null });
    const changeStatus = async (id, index) => {
        const updatedFaqs = [...faqsList];
        updatedFaqs[index].status = !updatedFaqs[index].status;
        const change = await NestAPI.changeStatusForNestPrice(id);
        setFaqsList(updatedFaqs);
        setVinh(true);
    };
    const [nestPriceForUpdate, setNestPriceForUpdate] = useState({
        id: null,
        createdDate: null,
        speciesId: null,
        status: null,
        price: null,
        speciesName: null,
    });
    const [updateStatus, setUpdateStatus] = useState(false);
    const [token, setToken] = useState(JSON.parse(localStorage.getItem('accessToken')));
    const navigate = useNavigate();
    useEffect(() => {
        const getUserByToken = async () => {
            try {
                console.log(token);
                const userByToken = await UserAPI.getUserByToken(token);
                if (
                    userByToken === null ||
                    userByToken === '' ||
                    userByToken === undefined ||
                    userByToken.length === 0
                ) {
                    navigate('/error');
                } else {
                    const userRole = await RoleAPI.getRoleName(userByToken.roleId);

                    if (userRole !== 'admin') {
                        navigate('/error');
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };
        getUserByToken();
    }, [token]);
    useEffect(() => {
        const getNestPriceList = async () => {
            try {
                const sortData = await NestAPI.searchSortForNestPrice(sort);
                setFaqsList(sortData.listResult);
                setTotalPage(sortData.totalPage);
            } catch (error) {
                console.error(error);
            }
        };
        if (vinh) {
            getNestPriceList();
            setVinh(false);
        }
        getNestPriceList();
    }, [sort, vinh]);

    useEffect(() => {
        const getNestPriceWithSpeciesName = async () => {
            const data = [];
            for (const item of faqsList) {
                const nestPrice = { ...item };
                nestPrice.species = await ParrotSpeciesAPI.get(item.speciesId);
                data.push(nestPrice);
            }
            setCombineData(data);
        };

        getNestPriceWithSpeciesName();
    }, [faqsList]);

    useEffect(() => {
        const getNestPriceList = async () => {
            try {
                const nestPriceList = await NestAPI.getAll();
                setNestPrice(nestPriceList);
            } catch (error) {
                console.error(error);
            }
        };
        if (show) {
            getNestPriceList();
        }
    }, [show]);

    useEffect(() => {
        const getSpecies = async () => {
            try {
                const speciesList = await ParrotSpeciesAPI.getAll();
                setSpecies(speciesList.listResult);
            } catch (error) {
                console.error(error);
            }
        };

        getSpecies();
    }, [show]);

    useEffect(() => {
        const addFaqs = async () => {
            try {
                const data = {
                    speciesId: title,
                    price: price,
                    status: status,
                };
                if (addStatus === false) {
                    setAddFail((prev) => prev + 1);
                    // setSubmitStatus(false);
                    setTimeout(() => {
                        setSubmitStatus();
                    }, 50000);
                } else {
                    const add = await NestAPI.addNestPrice(data);
                    setVinh(true);
                    setAddStatus(false);
                }
            } catch (error) {
                console.error(error);
            }
        };

        addFaqs();
    }, [addStatus]);

    useEffect(() => {
        const updateNestPrice = async () => {
            try {
                const data = {
                    createdDate: nestPriceForUpdate.createdDate,
                    speciesId: nestPriceForUpdate.speciesId,
                    price: nestPriceForUpdate.price,
                    status: nestPriceForUpdate.status,
                };
                if (updateStatus === false) {
                    setAddFail((prev) => prev + 1);
                    // setSubmitStatus(false);
                    setTimeout(() => {
                        setSubmitStatus();
                    }, 50000);
                } else {
                    const update = await NestAPI.updateNestPrice(data, nestPriceForUpdate.id);
                    setVinh(true);
                    setAddStatus(false);
                }
            } catch (error) {
                console.error(error);
            }
        };

        updateNestPrice();
        setNestPriceForUpdate({
            id: null,
            createdDate: null,
            speciesId: null,
            status: null,
            price: null,
            speciesName: null,
        });
    }, [updateStatus]);

    useEffect(() => {
        console.log(updateStatus);
    }, [updateStatus]);

    function formatDate(date) {
        const day = date.getDate();
        const month = date.getMonth() + 1; // Months are zero-indexed
        const year = date.getFullYear();

        const formattedDay = day < 10 ? `0${day}` : day;
        const formattedMonth = month < 10 ? `0${month}` : month;

        return `${formattedDay}/${formattedMonth}/${year}`;
    }

    const handleShow = () => {
        setShow(!show);
    };

    const handleShowForUpdate = (id, speciesId, createdDate, status, speciesName) => {
        if (showForUpdate === true) {
            setNestPriceForUpdate({
                id: null,
                createdDate: null,
                speciesId: null,
                status: null,
                price: null,
                speciesName: null,
            });
            setShowForUpdate(!showForUpdate);
        } else {
            setNestPriceForUpdate({
                ...nestPriceForUpdate,
                id: id,
                createdDate: createdDate,
                speciesId: speciesId,
                status: status,
                speciesName: speciesName,
            });
            setShowForUpdate(!showForUpdate);
        }
    };

    useEffect(() => {
        console.log(nestPriceForUpdate);
    }, [nestPriceForUpdate]);

    useEffect(() => {
        console.log(showForUpdate);
    }, [showForUpdate]);

    const handleSave = () => {
        if (title === '' || title === 'Species' || price === 0 || price < 0) {
            setAddFail((prev) => prev + 1);
            setSubmitStatus(false);
            setTimeout(() => {
                setSubmitStatus();
            }, 50000);
        } else {
            setAddStatus(true);
            setSubmitStatus(true);
            setTimeout(() => {
                setSubmitStatus();
            }, 50000);
        }
    };

    const handleSaveForUpdate = () => {
        if (
            nestPriceForUpdate.id === null ||
            nestPriceForUpdate.createdDate === null ||
            nestPriceForUpdate.price === '' ||
            nestPriceForUpdate.price === null ||
            nestPriceForUpdate.speciesName === null ||
            nestPriceForUpdate.status === null ||
            nestPriceForUpdate.speciesId === null
        ) {
            setAddFail((prev) => prev + 1);
            setSubmitStatus(false);
            setTimeout(() => {
                setSubmitStatus();
            }, 50000);
        } else {
            setUpdateStatus(true);
            setSubmitStatus(true);
            setTimeout(() => {
                setSubmitStatus();
            }, 50000);
            setShowForUpdate(!showForUpdate);
        }
    };

    const handleSwitch = () => {
        console.log('Switch');
        if (status === false) {
            setStatus(true);
        } else {
            setStatus(false);
        }
    };

    const [totalPage, setTotalPage] = useState(1);
    const [page, setPage] = useState(1);
    const handlePageChange = (newPage) => {
        setSort({
            page: newPage,
            limit: 10,
            searchDate: sort.searchDate,
            status: sort.status,
            sortPrice: sort.sortPrice,
        });

        setPage(newPage);
    };

    const handleClear = () => {
        setSort({
            page: 1,
            limit: 10,
            searchDate: null,
            status: null,
            sortPrice: null,
        });
    };
    const redirectBackToNest = () => {
        navigate('/admin/nest');
    };
    return (
        <Container className={cx('wrapper')} maxW="container.xl">
            <Box>
                <Text fontSize="20px" fontWeight="600" marginTop="5%">
                    NEST PRICE
                </Text>
            </Box>
            <Button colorScheme="gray" onClick={redirectBackToNest} marginBottom={5}>
                <Text fontSize={16} margin={0} padding={4}>
                    Back to nest list
                </Text>
            </Button>
            <div className={cx('add-btn')}>
                {/* <Button onClick={handleShow} colorScheme="green" size="lg">
                    Add
                    <span className={cx('span-icon', { 'rotate-icon': show })}>
                        {show ? <FontAwesomeIcon icon={faMinus} /> : <FontAwesomeIcon icon={faPlus} />}
                    </span>
                </Button> */}
                <Flex className={cx('add-button')} onClick={handleShow}>
                    <FontAwesomeIcon icon={faCirclePlus} />
                    <Text className={cx('add-role-text')}>Add</Text>
                </Flex>
            </div>
            {(submitStatus === true && (
                <Stack spacing={3} className={cx('alert')}>
                    <Alert status="success">
                        <AlertIcon />
                        There was an error processing your request
                    </Alert>
                </Stack>
            )) ||
                (submitStatus === false && (
                    <Stack spacing={3}>
                        <Alert status="error">
                            <AlertIcon />
                            There was an error processing your request
                        </Alert>
                    </Stack>
                ))}

            {show ? (
                <form>
                    <TableContainer paddingTop={10} paddingBottom={10}>
                        <Table variant="simple" className={cx('table-chakra')}>
                            <Thead>
                                <Tr>
                                    <Th colSpan={2}>New Nest Price</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                <Tr>
                                    <Td>Species</Td>
                                    <Td>
                                        <select onChange={(e) => setTitle(e.target.value)}>
                                            <option isChecked>Species</option>
                                            {species &&
                                                species.map((nestPrice, nestPriceIndex) => (
                                                    <option key={nestPriceIndex} value={nestPrice.id}>
                                                        {nestPrice.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </Td>
                                </Tr>
                                <Tr>
                                    <Td>Price</Td>
                                    <Td>
                                        <Input
                                            type="number"
                                            borderColor="black"
                                            placeholder="Price..."
                                            min="0"
                                            step="0.01"
                                            fontSize={18}
                                            value={price}
                                            onChange={(e) => setPrice(parseFloat(e.target.value))} // Convert input value to a number
                                            required
                                        />
                                    </Td>
                                </Tr>
                                <Tr>
                                    <Td>Status</Td>
                                    <Td>
                                        <Switch size="lg" colorScheme="green" onChange={handleSwitch}></Switch>
                                    </Td>
                                </Tr>
                                <Tr>
                                    <Td></Td>
                                    <Td className={cx('submit-btn')}>
                                        <Button
                                            colorScheme="green"
                                            onClick={handleSave}
                                            className={cx('save-btn')}
                                            fontSize={18}
                                        >
                                            Save
                                        </Button>
                                    </Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </TableContainer>
                </form>
            ) : (
                <></>
            )}

            {showForUpdate ? (
                <TableContainer paddingTop={10} paddingBottom={10}>
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th colSpan={2}>Update Nest Price</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr>
                                <Td>Species</Td>
                                <Td>{nestPriceForUpdate.speciesName}</Td>
                            </Tr>
                            <Tr>
                                <Td>Price</Td>
                                <Td>
                                    <Input
                                        type="number"
                                        borderColor="black"
                                        placeholder="Price..."
                                        fontSize={18}
                                        onChange={(e) =>
                                            setNestPriceForUpdate({
                                                ...nestPriceForUpdate,
                                                price: parseInt(e.target.value),
                                            })
                                        }
                                    />
                                </Td>
                            </Tr>
                            <Tr>
                                <Td></Td>
                                <Td>
                                    <Button onClick={handleSaveForUpdate} className={cx('save-btn')} fontSize={18}>
                                        Save
                                    </Button>
                                </Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </TableContainer>
            ) : (
                <></>
            )}
            <div className={cx('sort-space')}>
                <FontAwesomeIcon icon={faArrowsRotate} className={cx('refresh-icon')} onClick={handleClear} />
                <input
                    type="date"
                    id="date"
                    name="date"
                    onChange={(e) => setSort({ ...sort, searchDate: e.target.value })}
                />

                <select name="status" id="status" onChange={(e) => setSort({ ...sort, status: e.target.value })}>
                    <option value="" disabled selected>
                        Status
                    </option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>

                <select
                    name="sortPrice"
                    id="sortPrice"
                    onChange={(e) => setSort({ ...sort, sortPrice: e.target.value })}
                >
                    <option value="" disabled selected>
                        Price
                    </option>
                    <option value="PDESC">Descending</option>
                    <option value="PASC">Ascending</option>
                </select>

                <button></button>
            </div>
            <TableContainer>
                <Table size="lg" className={cx('table-chakra-crud')}>
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                            <Th>Species</Th>
                            <Th>Price</Th>
                            <Th>Created Date</Th>
                            <Th>Status</Th>
                            <Th>Action</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {combineData &&
                            combineData.map((faqs, index) => (
                                <Tr key={index}>
                                    <Td>{faqs.id}</Td>
                                    <Td>{faqs.species[0].name}</Td>
                                    <Td>{faqs.price}</Td>
                                    <Td>{formatDate(new Date(faqs.createdDate))}</Td>
                                    <Td>
                                        <Switch
                                            size="lg"
                                            isChecked={faqs.status}
                                            colorScheme="green"
                                            onChange={() => changeStatus(faqs.id, index)}
                                        />
                                    </Td>
                                    <Td>
                                        <Button
                                            colorScheme="green"
                                            onClick={() =>
                                                handleShowForUpdate(
                                                    faqs.id,
                                                    faqs.speciesId,
                                                    faqs.createdDate,
                                                    faqs.status,
                                                    faqs.species[0].name,
                                                )
                                            }
                                        >
                                            Update
                                        </Button>
                                    </Td>
                                </Tr>
                            ))}
                    </Tbody>
                </Table>
            </TableContainer>
            <div className={cx('button-pagination')}>
                <button disabled={page <= 1} onClick={() => handlePageChange(page - 1)} colorScheme="pink">
                    <FontAwesomeIcon icon={faAngleLeft} />
                </button>
                {Array.from({ length: totalPage }, (_, index) => (
                    <p
                        key={index}
                        className={cx('number-page')}
                        onClick={() => handlePageChange(index + 1)}
                        style={{
                            border: page === index + 1 ? '1px solid black' : 'none', // Change background color when on the current page
                            borderRadius: page === index + 1 ? '4px ' : 'none', // Change background color when on the current page
                            opacity: page === index + 1 ? '0.5' : '1', // Change background color when on the current page
                            backgroundColor: page === index + 1 ? '#f9ede9' : 'transparent', // Change background color when on the current page
                            color: page === index + 1 ? 'black' : '#000000', // Change text color when on the current page
                            padding: page === index + 1 ? '5px 7px' : '0px',
                            fontWeight: '600',
                        }}
                    >
                        {index + 1}
                    </p>
                ))}
                <button disabled={page === totalPage} onClick={() => handlePageChange(page + 1)} colorScheme="pink">
                    <FontAwesomeIcon icon={faAngleRight} />
                </button>
            </div>
        </Container>
    );
}

export default AdNestPriceManagement;
