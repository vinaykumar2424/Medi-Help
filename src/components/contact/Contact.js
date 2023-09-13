import { Link } from "react-router-dom";
import './contact.css'
import linkedln from '../images/linkedin.png'
import discord from '../images/discord.png'
import insta from '../images/instagram.png'
import React, { useState } from 'react';
import axios from 'axios';
const Contact = () => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(formData)
        try {
            await axios.post('http://localhost:5000/api/data', formData);
            alert('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Failed to send email');
        }
    };
    return (
        <div className="Contact">
            <nav>
                <ul>
                    <Link to="/"><li>Home</li></Link>
                    <Link to="/contact"><li>Contact</li></Link>
                    <Link to="/login"><li>Login</li></Link>
                </ul>
            </nav>
            <div className="ContactContent">
                <div className="TopPartContact">
                    <div>
                        <span className="material-symbols-outlined" style={{ fontSize: "8vw" }}>vital_signs</span>
                        <div className="contactheading1">
                            We are Medi-Help
                        </div>
                        <div className="contactheading2">Estibilish in 2023</div>
                    </div>
                    <div className="contactheading3">We help people to see their happy faces.</div>
                </div>
                <div className="contactheading4">You can reach us out</div>
                <div className="socialMediaHandles">
                    <div className="socialMediaHeading">Social Media</div>
                    <div className="socialMediaHandlesIcons">
                        <a href="https://www.linkedin.com/in/vinay-kumar-912619210" target="_blank" className="socialMediahandle">
                            <img className="socialMediahandle1" src={linkedln} alt="" />
                            <div>Linkedln</div>
                        </a>
                        <a href="" className="socialMediahandle" target="_blank">
                            <img className="socialMediahandle2" src={discord} alt="" />
                            <div>Discord</div>
                        </a>
                        <a href="https://www.instagram.com/vinay_k8287/" target="_blank" className="socialMediahandle">
                            <img className="socialMediahandle3" src={insta} alt="" />
                            <div>Instagram</div>
                        </a>
                    </div>
                </div>
                <form className="form" onSubmit={handleSubmit}>
                    <p>Tell us what's coming in your mind</p>
                    <div className="input-box">
                        <input type="text" required="required" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        <span>Name</span>
                    </div>
                    <div className="input-box">
                        <input type="email" required="required" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        <span>Email</span>
                    </div>
                    <div className="input-box">
                        <input type="number" required="required" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                        <span>Phone</span>
                    </div>
                    <div className="input-box">
                        <textarea id="text" rows="4" cols="50" required="required" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}></textarea>
                        <span>Message</span>
                    </div>
                    <button type="submit">Send Us</button>
                </form>
                <div className="contactheading5">Thank you to give your precious time </div>
            </div>
        </div>
    )
}

export default Contact;