import React from "react";
function Hero() {
  return (
    <section className="container-fluid" id="support-hero">
      <div className="p-4" id="support-hero-row">
        <h3>Support Portal</h3>
        <a href="" style={{ textDecoration: "none" }}>
          Track Ticket
        </a>
      </div>

      <div className="row p-3 m-3 ">
        <div className="col-6 p-5">
          <h1 className="fs-3">
            Search for an answer or browse help topics to create a ticket
          </h1>
          <input placeholder="Eg. how do I activate F&O, why is my order getting rejected. " />
          <br></br>
          <a
            href=""
            style={{
              textDecoration: "none",
              marginTop: "10px",
              display: "inline-block",
            }}
          >
            {" "}
            Track account opening
          </a>

          <a href="" style={{ textDecoration: "none", marginLeft: "10px" }}>
            Track segment activation
          </a>
          <a href="" style={{ textDecoration: "none", marginLeft: "10px" }}>
            Intraday margins
          </a>
          <a href="" style={{ textDecoration: "none", marginLeft: "10px" }}>
            Kite user manual
          </a>
        </div>
        <div className="col-6 p-5">
          <h1 className="fs-3">Featured</h1>
          <ol>
            <li className="mt-3">
              <a href="" style={{ textDecoration: "none" }}>
                {" "}
                Current Takeovers and Delisting - January 2025
              </a>
            </li>
            <li className="mt-3">
              <a href="" style={{ textDecoration: "none" }}>
                Latest Intraday leverage - MIS & CO
              </a>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}

export default Hero;
