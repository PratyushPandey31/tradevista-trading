import React from 'react'
function Education() {
    return ( 
        <div className='container mt-5'>
            <div className='row'>
                <div className='col-6'>
                    <img src='/media/images/Education.svg' alt='Education' style={{width:"70%"}}/>
                </div>

                <div className='col-6 '>
                    <h1 className='mb-3 fs-2'>Free and open market education</h1>
                    <p >Varsity, the largest online stock market education book in the world covering everything from the basics to advance trading.</p>
                    <a style={{textDecoration: "none"}} href='' >Versity<i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>

                    <p className='mt-5'>TradingQ&A, the most active trading and investment community in India for all your market related quries.</p>
                    <a style={{textDecoration: "none"}}href='' >TradingQ&A<i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>
                </div>
            </div>

        </div>
    );
}


export default Education;