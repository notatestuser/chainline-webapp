import styled from 'styled-components';

const StyledTable = styled.table`
  border-collapse: collapse;

  td,
  th {
    padding: 10px 0;
    border-bottom: 1px solid #eee;
  }

  tr:last-child td,
  tr:last-child th {
    border-bottom: none;
  }

  th {
    font-weight: 500;
    text-align: left;
    padding-right: 25px;
  }

  td {
    padding: 10px 20px;
    padding-right: 30px;
  }
`;

export default StyledTable;
