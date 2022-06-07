import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import NavbarAdmin from '../components/NavbarAdmin';
import DeleteData from '../components/DeleteData';
import { useQuery, useMutation } from 'react-query';
import { API } from '../config/api';

export default function CategoryAdmin() {
    let navigate = useNavigate();

    const [idDelete, setIdDelete] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    let { data: categories, refetch } = useQuery('categoriesCache', async () => {
        const response = await API.get('/categories');
        return response.data.data;
    });

    const handleEdit = (id) => {
        navigate(`/update-category/${id}`);
    };

    const handleDelete = (id) => {
        setIdDelete(id);
        handleShow();
    };

    const deleteById = useMutation(async (id) => {
        try {
            await API.delete(`/category/${id}`);
            refetch();
        } catch (error) {
            console.log(error);
        }
    });

    useEffect(() => {
        if (confirmDelete) {
            handleClose();
            deleteById.mutate(idDelete);
            setConfirmDelete(null);
        }
    }, [confirmDelete]);

    const addCategory = () => {
        navigate('/add-category');
    };

    return (
        <div>
            <NavbarAdmin />
            <Container className="py-5">
                <Row>
                    <Col>
                    <div className="text-header-category mb-4">List Category</div>
                    </Col>
                    <Col className="text-end">
                        <Button
                            onClick={addCategory}
                            className="btn-dark"
                            style={{ width: '100px' }}
                        >
                            Add
                        </Button>
                    </Col>
                    <Col xs="12">
                        <Table striped hover size="lg" variant="dark">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Category Name</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories?.map((item, index) => (
                                <tr key={index}>
                                    <td width="10%" className="align-middle">
                                    {index + 1}
                                    </td>
                                    <td width="60%" className="align-middle">
                                    {item.name}
                                    </td>
                                    <td width="30%">
                                    <Button
                                        onClick={() => {
                                            handleEdit(item.id);
                                        }}
                                        className="btn-sm btn-success me-2"
                                        style={{ width: '135px' }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            handleDelete(item.id);
                                        }}
                                        className="btn-sm btn-danger"
                                        style={{ width: '135px' }}
                                    >
                                        Delete
                                    </Button>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
            <DeleteData
                setConfirmDelete={setConfirmDelete}
                show={show}
                handleClose={handleClose}
            />
        </div>
    );
}