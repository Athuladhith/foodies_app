import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store'; 
import { registerDeliveryPerson } from '../../actions/DeliverypersonAction'; 
import { toast } from 'react-toastify';
import MainLayout from './MainLayout';
interface AuthState {
    isAuthenticated: boolean;
    error: any;
    loading: boolean;
}

const RegisterDeliveryPerson: React.FC = () => {
    const [deliveryPerson, setDeliveryPerson] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        password: "", 
    });

    const { name, email, phoneNumber, address, password } = deliveryPerson;
    const [avatar, setAvatar] = useState<string>("");
    const [avatarPreview, setAvatarPreview] = useState<string>("/images/default-avatar.png"); 

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        password: "", 
        avatar: "",
    });

    const dispatch = useDispatch();
    const { isAuthenticated, error, loading } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            toast.success("Deliveryboy Registered Succefully!")
            window.location.href = "/adminhome"; 
        }
        if (error) {
            console.log(error);
        }
    }, [dispatch, isAuthenticated, error]);

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePhoneNumber = (phoneNumber: string) => {
        return phoneNumber.length === 10 && /^[0-9]+$/.test(phoneNumber);
    };

    const validatePassword = (password: string) => {
       
        return password.length >= 8;
    };

    const validateForm = () => {
        let formErrors = { ...errors };

        formErrors.name = name ? "" : "Name is required";
        formErrors.email = validateEmail(email) ? "" : "Invalid email format";
        formErrors.phoneNumber = validatePhoneNumber(phoneNumber) ? "" : "Invalid phone number (must be 10 digits)";
        formErrors.address = address ? "" : "Address is required";
        formErrors.password = validatePassword(password) ? "" : "Password must be at least 8 characters long";

        setErrors(formErrors);

        return Object.values(formErrors).every((error) => error === "");
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === "avatar") {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result as string);
                    setAvatar(reader.result as string);
                }
            };
            reader.readAsDataURL(e.target.files![0]);
        } else {
            setDeliveryPerson({ ...deliveryPerson, [e.target.name]: e.target.value });
        }
    };

    const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            console.log("Validation failed");
            return;
        }

        const formData = new FormData();
        formData.set("name", name);
        formData.set("email", email);
        formData.set("phoneNumber", phoneNumber);
        formData.set("address", address);
        formData.set("password", password); 
        formData.set("avatar", avatar);
        dispatch(registerDeliveryPerson(formData) as any); 
    };

    return (
        <MainLayout>
        <div className='row wrapper'>
            <div className='col-10 col-lg-5 registration-form'>
                <form className='shadow-lg' onSubmit={submitHandler} encType='multipart/form-data'>
                    <h1 className='mb-3'>Register Delivery Person</h1>
                    <div className='form-group'>
                        <label htmlFor='name_field'>Name</label>
                        <input
                            type="text"
                            id="name_field"
                            className={`form-control ${errors.name && 'is-invalid'}`}
                            name="name"
                            value={name}
                            onChange={onChange}
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>

                    <div className='form-group'>
                        <label htmlFor='email_field'>Email</label>
                        <input
                            type="email"
                            id="email_field"
                            className={`form-control ${errors.email && 'is-invalid'}`}
                            name="email"
                            value={email}
                            onChange={onChange}
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>

                    <div className='form-group'>
                        <label htmlFor='phoneNumber_field'>Phone Number</label>
                        <input
                            type="number"
                            id="phoneNumber_field"
                            className={`form-control ${errors.phoneNumber && 'is-invalid'}`}
                            name="phoneNumber"
                            value={phoneNumber}
                            onChange={onChange}
                        />
                        {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
                    </div>

                    <div className='form-group'>
                        <label htmlFor='address_field'>Address</label>
                        <input
                            type="text"
                            id="address_field"
                            className={`form-control ${errors.address && 'is-invalid'}`}
                            name="address"
                            value={address}
                            onChange={onChange}
                        />
                        {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                    </div>

                    <div className='form-group'>
                        <label htmlFor='password_field'>Password</label>
                        <input
                            type="password"
                            id="password_field"
                            className={`form-control ${errors.password && 'is-invalid'}`}
                            name="password"
                            value={password}
                            onChange={onChange}
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>
                    <div className='form-group'>
                        <label htmlFor='avatar_upload'>Avatar</label>
                        <div className='d-flex align-items-center'>
                            <div>
                                <figure className='avatar mr-3 item-rtl'>
                                    <img src={avatarPreview} className='rounded-circle' alt="Avatar Preview" />
                                </figure>
                            </div>
                            <div className='custom-file'>
                                <input
                                    type='file'
                                    name='avatar'
                                    className='custom-file-input'
                                    id="customFile"
                                    accept='image/*'
                                    onChange={onChange}
                                />
                                <label className='custom-file-label' htmlFor='customFile'>Choose Avatar</label>
                            </div>
                        </div>
                    </div>

                    <button
                        id="register_button"
                        type="submit"
                        className='btn btn-block py-3'
                        disabled={loading}
                    >
                        REGISTER
                    </button>
                </form>
            </div>
        </div>
        </MainLayout>
    );
};

export default RegisterDeliveryPerson;