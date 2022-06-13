import { Component, xml } from "@odoo/owl";

class LetterInformationViewer extends Component {

  static template = xml`
    <div class="flex bg-white shadow-lg relative z-10 border-b border-solid border-slate-200">
      <div class="py-3 px-4 mr-10">
        <h4 class="font-semibold text-gray-800 border-b border-solid border-gray-100 mb-2">Child Data</h4>
        <div class="flex text-sm">
          <p class="w-32 text-slate-700 font-medium">First Name</p>
          <p class="text-slate-800">Iren</p>
        </div>
        <div class="flex text-sm">
          <p class="w-32 text-slate-700 font-medium">Last Name</p>
          <p class="text-slate-800">Iden</p>
        </div>
        <div class="flex text-sm">
          <p class="w-32 text-slate-700 font-medium">Sex</p>
          <p class="text-slate-800">Woman</p>
        </div>
        <div class="flex text-sm">
          <p class="w-32 text-slate-700 font-medium">Age</p>
          <p class="text-slate-800">10 Years Old</p>
        </div>
      </div>
      <div class="py-3 px-4 mr-10">
        <h4 class="font-semibold text-gray-800 border-b border-solid border-gray-100 mb-2">Sponsor Data</h4>
        <div class="flex text-sm">
          <p class="w-32 text-slate-700 font-medium">First Name</p>
          <p class="text-slate-800">Natanaele</p>
        </div>
        <div class="flex text-sm">
          <p class="w-32 text-slate-700 font-medium">Last Name</p>
          <p class="text-slate-800">Di Sabatino</p>
        </div>
        <div class="flex text-sm">
          <p class="w-32 text-slate-700 font-medium">Sex</p>
          <p class="text-slate-800">Man</p>
        </div>
        <div class="flex text-sm">
          <p class="w-32 text-slate-700 font-medium">Age</p>
          <p class="text-slate-800">42 Years Old</p>
        </div>
      </div>
      <div class="py-3 px-4 flex-1">
        <h4 class="font-semibold text-gray-800 border-b border-solid border-gray-100 mb-2">Translation</h4>
        <div class="flex text-sm">
          <p class="w-32 text-slate-700 font-medium">Translator</p>
          <p class="text-slate-800">Sergi Alessandro</p>
        </div>
        <div class="flex text-sm">
          <p class="w-32 text-slate-700 font-medium">Letter Identifier</p>
          <p class="text-slate-800">1501077</p>
        </div>
        <div class="flex text-sm">
          <p class="w-32 text-slate-700 font-medium">Language</p>
          <p class="text-slate-800">Italiano</p>
        </div>
      </div>
    </div>
  `;
}

export default LetterInformationViewer;