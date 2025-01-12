import {
  Badge,
  Button,
  Card,
  Input,
  Modal,
  Select,
  Table,
  message,
} from "antd";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { Buffer } from "buffer";
import { DownloadOutlined } from "@ant-design/icons";

export function TS_Status() {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [yearData, setYearData] = useState(Array<any>);
  const [monthData, setMonthData] = useState(Array<any>);
  const [empData, setEmpData] = useState(Array<any>);
  const [year, setYear] = useState();
  const [month, setMonth] = useState();
  const [page, setPage]: any = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [rowData, setRowData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [leavesTaken, setLeavesTaken] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [daysWorked, setDaysWorked] = useState(0);
  const [empName, setEmpName] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imgVisible, setImgVisible] = useState(false);
  const [imageData, setImageData] = useState("");

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedRowKeys(selectedRowKeys);
      setRowData(selectedRows);
      if (selectedRowKeys[0]) {
        setLeavesTaken(selectedRows[0].noOfLeaveTaken);
        setTotalHours(selectedRows[0].total_Hours);
        setDaysWorked(selectedRows[0].noOfDaysWorked);
        setEmpName(selectedRows[0].full_Name);
      }
    },
    selectedRowKeys,
  };

  type AlignType = "left" | "center" | "right" | undefined;
  const yearCols = [
    {
      title: "Sl.No",
      dataIndex: "id",
      key: "ids",
      render: (value: any, item: any, index: any) =>
        (page - 1) * pageSize + index + 1,
      align: "center" as AlignType,
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      align: "center" as AlignType,
      render: (text: string, record: any) => (
        <a
          onClick={() => {
            setSelectedYear(record.year);
            setYear(record.year);
          }}
          style={{ fontWeight: 700 }}
        >
          {text}
        </a>
      ),
    },
  ];
  const monthCols = [
    {
      title: "Sl.No",
      dataIndex: "id",
      key: "ids",
      render: (value: any, item: any, index: any) =>
        (page - 1) * pageSize + index + 1,
      align: "center" as AlignType,
    },
    {
      title: "Timesheet",
      dataIndex: "month",
      key: "month",
      align: "center" as AlignType,
      render: (text: string, record: any) => (
        <a
          onClick={() => {
            setSelectedMonth(record.month);
            setMonth(record.monthID);
          }}
          style={{ fontWeight: 700 }}
        >
          {text}
        </a>
      ),
    },
    {
      title: "Total Timesheets",
      dataIndex: "timeSheet_Count",
      key: "timeSheet_Count",
      align: "center" as AlignType,
    },
    {
      title: "Approved Timesheets",
      dataIndex: "approved",
      key: "approved",
      align: "center" as AlignType,
    },
    {
      title: "Rejected Timesheets",
      dataIndex: "rejected",
      key: "rejected",
      align: "center" as AlignType,
    },
    {
      title: "Pending Timesheets",
      dataIndex: "pending",
      key: "pending",
      align: "center" as AlignType,
    },
  ];

  const statscols = [
    {
      title: "Sl.No",
      dataIndex: "id",
      key: "ids",
      render: (value: any, item: any, index: any) =>
        (page - 1) * pageSize + index + 1,
      align: "center" as AlignType,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: any) => moment(date).format("DD-MM-YYYY"),
      align: "center" as AlignType,
    },
    {
      title: "Days",
      dataIndex: "day",
      key: "day",
      align: "center" as AlignType,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center" as AlignType,
    },
    {
      title: "Project",
      dataIndex: "project",
      key: "project",
      align: "center" as AlignType,
    },
    {
      title: "Hours worked",
      dataIndex: "duration",
      key: "duration",
      align: "center" as AlignType,
    },
  ];

  const empCols = [
    {
      title: "Sl.No",
      dataIndex: "id",
      key: "ids",
      render: (value: any, item: any, index: any) =>
        (page - 1) * pageSize + index + 1,
      align: "center" as AlignType,
    },
    {
      title: "Employee Id",
      dataIndex: "employee_Id",
      key: "employee_Id",
      align: "center" as AlignType,
    },
    {
      title: "Employee Name",
      dataIndex: "full_Name",
      key: "full_Name",
      align: "center" as AlignType,
    },
    {
      title: "Employee Type",
      dataIndex: "employee_Type",
      key: "employee_Type",
      align: "center" as AlignType,
    },
    {
      title: "No. of days worked",
      dataIndex: "noOfDaysWorked",
      key: "noOfDaysWorked",
      align: "center" as AlignType,
    },
    {
      title: "No. of leave taken",
      dataIndex: "noOfLeaveTaken",
      key: "noOfLeaveTaken",
      align: "center" as AlignType,
    },
    {
      title: "Hours worked",
      dataIndex: "total_Hours",
      key: "total_Hours",
      align: "center" as AlignType,
    },
    {
      title: "Email",
      dataIndex: "emailId",
      key: "emailId",
      align: "center" as AlignType,
    },
    {
      title: "Reporting Manager",
      dataIndex: "reporting_Manager",
      key: "reporting_Manager",
      align: "center" as AlignType,
    },
    {
      title: "View Timesheet",
      dataIndex: "employee_Id",
      key: "view_timesheet",
      align: "center" as AlignType,
      render: (employeeId: any) => {
        return (
          <>
            <Button
              disabled={
                employeeId === selectedRowKeys[0] && rowData.length === 1
                  ? false
                  : true
              }
              type="link"
              onClick={() => {
                handleViewTimesheet(employeeId);
                showModal();
              }}
              style={{ fontWeight: 800 }}
            >
              View Timesheet
            </Button>
          </>
        );
      },
    },

    {
      title: "Timesheet status",
      dataIndex: "status",
      key: "status",
      align: "center" as AlignType,
      render: (status: any, record: any) => (
        <Select
          defaultValue={status}
          onChange={(newStatus: any) =>
            updateTimesheetStatus(record.employee_Id, newStatus)
          }
          disabled={status === "Approved"}
        >
          <Select.Option value="Pending">Pending</Select.Option>
          <Select.Option value="Approved">Approved</Select.Option>
          <Select.Option value="Rejected">Rejected</Select.Option>
        </Select>
      ),
    },
    {
      title: "View Image",
      dataIndex: "employee_Id",
      key: "view_image",
      align: "center" as AlignType,
      render: (employeeId: any, record: any) => {
        return (
          <Button
            disabled={employeeId !== selectedRowKeys[0] || rowData.length !== 1}
            type="link"
            onClick={() => handleViewImage(record.imagePathTimesheet)}
            style={{ fontWeight: 800 }}
          >
            View Image
          </Button>
        );
      },
    },
  ];
  const YearData = async () => {
    axios({
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
      url: "/api/Admin/GetTimeSheetStatus",
    })
      .then((r: any) => {
        setYearData(r.data);
        //message.success("Data fetched successfully");
      })
      .catch((error: any) => {
       // message.error(error.message);
      });
  };

  useEffect(() => {
    YearData();
  }, []);

  const MonthData = async () => {
    axios({
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
      url: `/api/Admin/GetTimeSheetStatusStatusByYear?year=${year}`,
    })
      .then((r: any) => {
        setMonthData(r.data);
        setTotalTS(r.data[0].timeSheet_Count);
        setApprovedTS(r.data[0].approved);
        setPendingTS(r.data[0].pending);
        setRejectedTS(r.data[0].rejected);
      })
      .catch((error: any) => {});
  };
  const [totalTS, setTotalTS] = useState();
  const [approvedTS, setApprovedTS] = useState();
  const [pendingTS, setPendingTS] = useState();
  const [rejectedTS, setRejectedTS] = useState();
  useEffect(() => {
    MonthData();
  }, [year]);

  const EmpData = async () => {
    axios({
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
      url: `/api/Admin/GetTimeSheetStatusStatusByMonth?Month_id=${month}&Year=${year}`,
    })
      .then((r: any) => {
        setEmpData(r.data);
      })
      .catch((error: any) => {
       // message.error(error.message);
      });
  };

  useEffect(() => {
    EmpData();
  }, [year, month]);

  // approve or reject timesheet
  const updateTimesheetStatus = (employeeId: number, newStatus: any) => {
    const ids = selectedRowKeys;
    if (!ids || ids.length === 0) {
      message.error("First select the rows you wish to undo");
      return;
    }
    const editTimeSheetModelById = [
      { employee_id: employeeId, month_Id: month, year: year },
    ];
    const data = {
      timesheet_Status: newStatus,
      editTimeSheetModelById: editTimeSheetModelById,
    };

    axios({
      method: "put",
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
      url: `/api/Admin/EditTimesheetStatus`,
      data: data,
    })
      .then((response) => {
        message.success("Timesheet status updated");
      })
      .catch((error) => {
        //message.error(error.message);
      });
  };
  // For ViewTimesheet
  const [timesheetData, setTimesheetData] = useState([]);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleViewTimesheet = async (employeeId: any) => {
    axios({
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
      url: `/api/Admin/GetTimesheetSummaryMonthYearEmployee?Month_id=${month}&Year_id=${year}&Employee_Id=${employeeId}`,
    })
      .then((r: any) => {
        setTimesheetData(r.data);
      })
      .catch((error: any) => {
        // message.error(error.message);
      });
  };

  //download Timesheets of that month
  const [modalVisible, setModalVisible] = useState(false);
  const handleDownload = async () => {
    setModalVisible(true);
  };

  const handleYes = async () => {
    try {
      const url = `/api/Admin/ExportTimesheetByMonthToExcel?year=${year}&Fiscial_Year_Id=${month}`;
      const response = await axios.get(url, {
        responseType: "blob", // important: we're expecting a binary response
      });
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", "filename.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      setModalVisible(false);
    } catch (error) {}
  };

  const handleNO = () => {
    setModalVisible(false);
  };

  //Search
  const [searchTextYear, setSearchTextYear] = useState("");
  const [searchTextMonth, setSearchTextMonth] = useState("");
  const [searchTextEmp, setSearchTextEmp] = useState("");

  const filteredYearData = yearData.filter((record: any) => {
    const values = Object.values(record).join(" ").toLowerCase();
    return values.includes(searchTextYear.toLowerCase());
  });
  const filteredMonthData = monthData.filter((record: any) => {
    const values = Object.values(record).join(" ").toLowerCase();
    return values.includes(searchTextMonth.toLowerCase());
  });
  const filteredEmpData = empData.filter((record: any) => {
    const values = Object.values(record).join(" ").toLowerCase();
    return values.includes(searchTextEmp.toLowerCase());
  });

  const showImgModal = () => {
    setImgVisible(true);
  };

  const handleImgOk = () => {
    setImgVisible(false);
  };

  const handleImgCancel = () => {
    setImgVisible(false);
  };
  const handleViewImage = (imagePath: any) => {
    showImgModal();
    axios

      .get(
        `/api/Employee/ImagePath?imagePath=${encodeURIComponent(imagePath)}`,
        {
          responseType: "arraybuffer",
        }
      )
      .then((response) => {
        const imageData = Buffer.from(response.data, "binary").toString(
          "base64"
        );
        setImageData(`data:image/png;base64,${imageData}`);
      })
      .catch((error) => console.log(error));
  };

  const renderYearTable = () => {
    return (
      <Card
        style={{
          width: "100%",
          marginTop: 16,
          paddingTop: 10,
          background:
            "-webkit-linear-gradient(45deg,rgba(9, 0, 159, 0.2), rgba(0, 255, 149, 0.2) 55%)",
        }}
      >
        <Input.Search
          value={searchTextYear}
          onChange={(e: any) => setSearchTextYear(e.target.value)}
          placeholder="Search"
          style={{
            width: 110,
            textAlign: "center",
            marginRight: 5,
            borderRadius: 4,
            padding: 3,
            background:
              "-webkit-linear-gradient(45deg, rgba(9, 0, 159, 0.9), rgba(0, 255, 149, 0.5) 105%)",
            color: "black",
            fontWeight: "bold",
          }}
        />

        <Table
          bordered
          dataSource={filteredYearData}
          columns={yearCols}
          pagination={false}
        />
      </Card>
    );
  };

  const renderMonthTable = () => {
    // const filteredMonthData = monthData.filter((month) =>
    //   month.month.includes(selectedYear)
    // );
    return (
      <Card
        style={{
          width: "100%",
          marginTop: 16,
          paddingTop: 10,
          background:
            "-webkit-linear-gradient(45deg,rgba(9, 0, 159, 0.2), rgba(0, 255, 149, 0.2) 55%)",
        }}
      >
        <Input.Search
          value={searchTextMonth}
          onChange={(e: any) => setSearchTextMonth(e.target.value)}
          placeholder="Search"
          style={{
            width: 110,
            textAlign: "center",
            marginRight: 5,
            borderRadius: 4,
            padding: 3,
            background:
              "-webkit-linear-gradient(45deg, rgba(9, 0, 159, 0.9), rgba(0, 255, 149, 0.5) 105%)",
            color: "black",
            fontWeight: "bold",
          }}
        />
        <Table
          bordered
          dataSource={filteredMonthData}
          columns={monthCols}
          pagination={false}
        />
      </Card>
    );
  };

  const renderEmployeeTable = () => {
    // const filteredEmployeeData = empData.filter(
    //   (employee) => employee.timesheetStatus === selectedMonth
    // );
    return (
      <Card
        style={{
          width: "100%",
          marginTop: 16,
          paddingTop: 10,
          background:
            "-webkit-linear-gradient(45deg,rgba(9, 0, 159, 0.2), rgba(0, 255, 149, 0.2) 55%)",
        }}
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 1000,
            }}
          >
            <div>Total Timesheets: {totalTS}</div>
            <div>Approved Timesheets: {approvedTS}</div>
            <div>Rejected Timesheets: {rejectedTS}</div>
            <div>Pending Timesheets: {pendingTS}</div>
          </div>
        }
      >
        <Input.Search
          value={searchTextEmp}
          onChange={(e: any) => setSearchTextEmp(e.target.value)}
          placeholder="Search"
          style={{
            width: 110,
            textAlign: "center",
            marginRight: 5,
            borderRadius: 4,
            padding: 3,
            background:
              "-webkit-linear-gradient(45deg, rgba(9, 0, 159, 0.9), rgba(0, 255, 149, 0.5) 105%)",
            color: "black",
            fontWeight: "bold",
          }}
        />
        <Button
          type="primary"
          onClick={handleDownload}
          style={{
            display: "flex",
            float: "right",
            background:
              "-webkit-linear-gradient(45deg, rgba(9, 0, 159, 0.3), rgba(0, 255, 149, 0.3) 95%)",
            color: "black",
            fontWeight: "bold",
          }}
        >
          Download
          <DownloadOutlined />
        </Button>
        <Table
          bordered
          rowKey={(record) => record.employee_Id}
          dataSource={filteredEmpData}
          columns={empCols}
          rowSelection={rowSelection}
          pagination={false}
          scroll={{ x: "max-content" }}
        />
        <Modal
          open={modalVisible}
          onOk={handleImgOk}
          onCancel={handleNO}
          footer={[
            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
              <Button key="ok" type="primary" onClick={handleYes}>
                Yes
              </Button>
              <Button key="cancel" onClick={handleNO}>
                No
              </Button>
            </div>,
          ]}
        >
          <p
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              fontWeight: 500,
            }}
          >
            Do you want to download timesheet for the month?
          </p>
        </Modal>
        <Modal
          open={imgVisible}
          onCancel={handleImgCancel}
          footer={null}
          width={850}
        >
          <img src={imageData} alt="Employee Image" style={{ width: 790 }} />
        </Modal>
      </Card>
    );
  };

  return (
    <>
      <div>
        <h2>Timesheet Status</h2>
        {renderYearTable()}
        {selectedYear && (
          <>
            <h2>Timesheet Status ({selectedYear})</h2>
            {renderMonthTable()}
          </>
        )}
        {selectedMonth && (
          <>
            <h2>
              Timesheet Status ({selectedMonth} -{selectedYear} )
            </h2>
            {renderEmployeeTable()}

            <Modal
              open={isModalOpen}
              onCancel={handleCancel}
              footer={
                <div
                  style={{
                    display: "flex",
                    fontWeight: 600,
                    justifyContent: "space-between",
                  }}
                >
                  <Badge color="green" text="P-Present" />
                  <Badge color="red" text="L-Leave" />
                  <Badge color="blue" text="H-Holiday" />
                  <Badge color="#f50" text="WFH-Work From Home" />
                  <Button onClick={handleCancel}>Cancel</Button>
                </div>
              }
              width={700}
            >
              <div>
                <h2>
                  Timesheet Status ({selectedMonth} -{selectedYear}- {empName} )
                </h2>
                <Card
                  title={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>Leaves Taken: {leavesTaken}</div>
                      <div>Total Hours Worked: {totalHours}</div>
                      <div>No. of Days worked: {daysWorked}</div>
                    </div>
                  }
                >
                  <Table
                    bordered
                    dataSource={timesheetData}
                    columns={statscols}
                    pagination={false}
                  />
                </Card>
              </div>
            </Modal>
          </>
        )}
      </div>
    </>
  );
}
