<script setup lang="ts">
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

async function exportExcel() {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Sheet1')

  worksheet.addRow(['Name', 'Score'])
  worksheet.addRow(['Alice', 95])
  worksheet.addRow(['Bob', 88])

  const buffer = await workbook.xlsx.writeBuffer()
  saveAs(
    new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }),
    'demo.xlsx'
  )
}
</script>

<template>
  <div>
    <button @click="exportExcel">导出 Excel（exceljs）</button>
  </div>
</template>

<style scoped>
button {
  padding: 6px 12px;
  border-radius: 6px;
}
</style>
