import React from "react";

function App() {
  return (
<div className="App">
  <div className="step" id="bio">
    <h2 className="section_title">Presentation</h2>
    <h3 className="main_question">Personal info</h3>
    <div className="form-group add_top_30">
      <label for="name">First and Last Name</label>
      <input type="text" name="name" id="name" class="form-control required" onchange="getVals(this, 'name_field');"/>
    </div>
    <div className="form-group">
      <label for="email">Email Address</label>
      <input type="email" name="email" id="email" className="form-control required" onchange="getVals(this, 'email_field');"/>
    </div>
    <div className="form-group">
      <label for="phone">Phone</label>
      <input type="text" name="phone" id="phone" className="form-control required"/>
    </div>
    <label>Gender</label>
    <div className="form-group radio_input">
      <label className="container_radio mr-3">Male
        <input type="radio" name="gender" value="Male" className="required"/>
        <span className="checkmark"></span>
      </label>
      <label className="container_radio">Female
        <input type="radio" name="gender" value="Female" className="required"/>
        <span className="checkmark"></span>
      </label>
    </div>
    <div className="form-group add_bottom_30 add_top_20">
    <label>Upload Resume<br/><small>(File accepted: .pdf, .doc/docx - Max file size: 150KB for demo limit)</small></label>
    <div className="fileupload">
      <input type="file" name="fileupload" accept=".pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="required"/>
    </div>
    </div>
  </div>
</div>
  );
}

export default App;
